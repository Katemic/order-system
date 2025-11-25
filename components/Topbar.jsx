import Link from "next/link";

export default function Topbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-neutral-200 shadow-sm z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-black">
          Byens bager
        </Link>

        <nav className="flex items-center gap-6 text-sm text-neutral-700">
          <Link href="/products" className="hover:text-black transition">
            Produkter
          </Link>
          <Link href="/orders" className="hover:text-blue-600">
            Bestillinger
          </Link>

          <Link href="/createOrder" className="btn-primary">
            Opret bestilling
          </Link>
        </nav>
      </div>
    </header>
  );
}
