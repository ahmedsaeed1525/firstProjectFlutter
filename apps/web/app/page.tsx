import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to 3D Bazaar</h1>
      <p>The Next.js web application is running.</p>
      <p>Milestone 1: Monorepo scaffold complete.</p>
      <br />
      <Link href="/products" style={{ fontSize: '1.2rem', color: 'blue' }}>
        View All Products
      </Link>
    </main>
  );
}
