import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";

const CATEGORIES = [...PRODUCT_CATEGORIES, "Alle", "Arkiverede"];

export default function Sidebar({ selectedCategory, onItemClick, basePath = "/products", isAdmin }) {
  const baseClasses =
    "block rounded-md px-3 py-2 text-sm font-medium text-left w-full transition";

  const activeCategory = selectedCategory || "Brød";

  return (
    <nav className="h-full flex flex-col px-4 py-6 text-neutral-700">
      <div className="flex-1 min-h-0 flex flex-col">
        <form
          action={basePath}
          method="GET"
          className="mb-4 grid grid-cols-[1fr_auto] gap-2 overflow-hidden"
        >
          <input
            type="text"
            name="search"
            placeholder="Søg produkter…"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-md 
                       bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            Søg
          </button>
        </form>

        <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Kategorier
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-1 overflow-y-auto pr-1">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            const href = `${basePath}?category=${encodeURIComponent(category)}`;

            const className =
              baseClasses +
              (isActive
                ? " bg-neutral-200 text-black"
                : " hover:bg-neutral-100 hover:text-black");

            return (
              <Link
                key={category}
                href={href}
                className={className}
                onClick={onItemClick}
              >
                {category}
              </Link>
            );
          })}
        </div>
      </div>

      {basePath === "/products" && isAdmin && (
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <Link
            href="/createProduct"
            className="block w-full text-center px-4 py-2 
                       bg-emerald-600 text-white rounded-lg 
                       hover:bg-emerald-700 transition"
            onClick={onItemClick}
          >
            + Opret produkt
          </Link>
        </div>
      )}
    </nav>
  );
}
