import type { Metadata } from "next";
import "./globals.css";
import { inter, openSans } from "./ui/fonts";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Pet Shelter & internal CRM",
  description: "Find your new best friend.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${openSans.variable}`}>
        {children}
        <Toaster position="bottom-center" reverseOrder={false} />
      </body>
    </html>
  );
}
