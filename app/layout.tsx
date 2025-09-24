import type { Metadata } from "next";
import "./globals.css";
import { inter, openSans, fontgeist } from "./ui/fonts";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Animal Shelter & Operations Platform",
  description: "Find your new best friend.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontgeist.className} ${openSans.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
