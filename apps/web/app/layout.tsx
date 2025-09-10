import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Bazaar",
  description: "The future of e-commerce is here.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
