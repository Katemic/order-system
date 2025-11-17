import Link from 'next/link';

export default function Topbar() {
  return (
    <header className="w-full bg-white border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-start">
        <h1 className="text-xl font-bold tracking-tight text-black">
          Byens bager
        </h1>
        <nav className="flex items-center gap-6 text-sm text-neutral-700 ml-12">
          <Link href="/products" className="hover:text-black transition">
            Produkter
          </Link>
        </nav>
      </div>
    </header>
  );
}

