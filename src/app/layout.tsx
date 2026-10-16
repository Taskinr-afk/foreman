import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foreman",
  description: "AI-powered OSHA safety compliance platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="h-full w-full m-0 p-0">{children}</body>
    </html>
  );
}
