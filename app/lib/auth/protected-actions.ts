import { hasPermission } from "./hasPermission";
import { auth } from "@/auth";
import { type Session } from "next-auth";

export type SessionUser = Session["user"];

/**
 * A HOF that protects an action by ensuring the user is authenticated.
 * It passes the precise SessionUser object to the wrapped action.
 */
export function withAuthenticatedUser<TArgs extends any[], TReturn>(
  // SessionUser
  action: (user: SessionUser, ...args: TArgs) => Promise<TReturn>
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const session = await auth();
    if (!session?.user) {
      throw new Error(
        "Access Denied. You must be logged in to perform this action."
      );
    }
    return action(session.user, ...args);
  };
}

/**
 * A decorator-style function for protecting server actions with permission-based checks.
 * @param requiredPermission The permission required to execute the action.
 * @returns A function that takes the target action and returns a new, protected version of it.
 */
export function RequirePermission(requiredPermission: string) {
  // The outer function takes the permission string
  return function <T extends (...args: any[]) => Promise<any>>(target: T): T {
    // The inner function takes the server action (`target`)
    const protectedAction = async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      const isAllowed = await hasPermission(requiredPermission);
      if (!isAllowed) {
        throw new Error(
          "Access Denied. You do not have permission to perform this action."
        );
      }
      // The original function is called with its arguments
      return target(...args);
    };
    return protectedAction as T;
  };
}