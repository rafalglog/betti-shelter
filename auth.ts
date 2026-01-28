import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { authProviderConfigList } from "./auth.config";
import { Role } from "@prisma/client"; // Import the Role enum

// declare custom user properties
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    role: Role;
    personId: string;
    mustChangePassword: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      personId: string;
      mustChangePassword: boolean;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}
declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role;
    personId: string;
    mustChangePassword: boolean;
  }
}
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: Role;
    personId: string;
    mustChangePassword: boolean;
  }
}

// get user from db
const getUser = async (email: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
};

const CustomPrismaAdapter = (p: typeof prisma) => {
  return {
    ...PrismaAdapter(p),
    createUser: async (data: any) => {
      // Use a transaction to ensure both Person and User are created successfully
      const user = await p.$transaction(async (tx) => {
        // Create the Person record first
        const person = await tx.person.create({
          data: {
            name: data.name,
            email: data.email,
          },
        });

        // Create the User and connect it to the new Person
        const user = await tx.user.create({
          data: {
            email: data.email,
            image: data.image,
            emailVerified: data.emailVerified,
            person: {
              connect: {
                id: person.id,
              },
            },
          },
        });

        return user;
      });

      return {
        ...user,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      };
    },
  };
};

// credentials setup for admin email/password login
const credentialsConfig = Credentials({
  // The credentials object is used to define the fields used to log in
  credentials: {
    email: {
      label: "Email",
      type: "email",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },
  // The authorize callback validates credentials
  authorize: async (credentials) => {
    // Validate the credentials for the user
    const parsedCredentials = z
      .object({ email: z.email(), password: z.string().min(6) })
      .safeParse(credentials);

    // If the credentials are valid, return the user object
    if (parsedCredentials.success) {
      const { email, password } = parsedCredentials.data;

      const user = await getUser(email);

      // If user does not exist or password is missing, throw an error
      if (!user || !user.password) return null;

      const passwordsMatch = await bcrypt.compare(password, user.password);

      // If the password is correct, return the user object
      if (passwordsMatch) {
        if (!user.emailVerified) {
          throw new Error("EmailNotVerified");
        }
        return user;
      }
    }
    return null;
  },
});

// auth config
export const authConfig = {
  adapter: CustomPrismaAdapter(prisma),
  callbacks: {
    async jwt({ token }) {
      if (token.sub) {
        const existingUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            role: true,
            personId: true,
            mustChangePassword: true,
            person: { select: { name: true } },
          },
        });

        if (existingUser) {
          token.personId = existingUser.personId;
          token.role = existingUser.role;
          token.mustChangePassword = existingUser.mustChangePassword;
          if (existingUser.person?.name) {
            token.name = existingUser.person.name;
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
        session.user.personId = token.personId as string;
        session.user.name = token.name as string;
        session.user.mustChangePassword = token.mustChangePassword as boolean;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [...authProviderConfigList.providers, credentialsConfig],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Re-export providerMap for convenience
export { providerMap } from "./auth.config";
