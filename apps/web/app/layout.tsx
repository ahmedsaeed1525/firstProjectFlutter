'use client'; // To use hooks in Header

import type { Metadata } from "next";
import Link from 'next/link';
import "./globals.css";
import { useCartStore, selectCartTotalItems } from "../stores/cartStore";
import { useEffect, useState } from "react";

// export const metadata: Metadata = {
//   title: "3D Bazaar",
//   description: "The future of e-commerce is here.",
// };
// Metadata export is not allowed in a client component.
// We would move this to a server component parent if needed, but for now, we can comment it out.

function Header() {
  const totalItems = useCartStore(selectCartTotalItems);
  // Zustand's persisted state is read from localStorage, which is only available on the client.
  // This causes a hydration mismatch between server and client render.
  // To fix, we only render the count on the client after it has mounted.
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
      <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>3D Bazaar</Link>
      <nav>
        <Link href="/products" style={{ marginRight: '1rem' }}>Products</Link>
        <Link href="/cart">Cart ({isClient ? totalItems : 0})</Link>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
