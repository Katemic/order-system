import Link from "next/link";

export default function Forbidden() {
  return (
    <main className="min-h-[calc(100vh-6rem)] flex items-start justify-center px-4 pt-28">
      <div className="w-full max-w-md text-center bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-neutral-900">Forbudt</h2>
        <p className="mt-2 text-neutral-600">
          Du er ikke autoriseret til at få adgang til denne ressource.
        </p>

        <Link
          href="/"
          className="inline-block mt-6 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          Returner til forsiden
        </Link>
      </div>
    </main>
  );
}
