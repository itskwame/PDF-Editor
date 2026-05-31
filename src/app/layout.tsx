import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookForge | Turn Your Idea Into a Finished Book",
  description:
    "Plan, write, edit, format, and export your book with a guided step-by-step process.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
