import type { Metadata } from "next";
import { DemoAuthProvider } from "@/components/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pyramid — Rights workspace",
  description: "One shared workspace for film and music rights.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><DemoAuthProvider>{children}</DemoAuthProvider></body></html>;
}
