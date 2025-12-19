import Link from "next/link";

export default function OrderNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-2xl font-semibold">
          Denne ordre findes ikke
        </h1>

        <p className="text-neutral-600">
          Ordren kan være blevet slettet, eller også er linket forkert.
        </p>

        <Link
          href="/orders"
          className="inline-flex items-center justify-center
                     px-4 py-2 rounded-lg
                     bg-emerald-600 text-white text-sm font-medium
                     hover:bg-emerald-700 transition"
        >
          Tilbage til bestillinger
        </Link>
      </div>
    </div>
  );
}
