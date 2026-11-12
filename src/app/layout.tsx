import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURENCE — Modern Luxury Fashion",
  description:
    "Discover refined menswear and womenswear. A considered approach to modern fashion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}