import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-2xl font-semibold">
          Dette produkt findes ikke
        </h1>

        <p className="text-neutral-600">
          Produktet kan være blevet slettet, eller også er linket forkert.
        </p>

        <Link
          href="/products"
          className="inline-flex items-center justify-center
                     px-4 py-2 rounded-lg
                     bg-emerald-600 text-white text-sm font-medium
                     hover:bg-emerald-700 transition"
        >
          Tilbage til produkter
        </Link>
      </div>
    </div>
  );
}
