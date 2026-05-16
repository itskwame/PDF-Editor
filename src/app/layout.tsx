import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreePDFFlow | Edit PDFs Online for Free",
  description:
    "Add text, signatures, dates, checkboxes, images, highlights, and more. Download 3 finished PDFs every month for free.",
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
