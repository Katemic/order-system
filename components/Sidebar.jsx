import Link from "next/link";

const CATEGORIES = [
  "Brød",
  "Morgenbrød",
  "Wienerbrød",
  "Konditor",
  "Mejeri",
  "Cafe",
  "Sæsonkager og andet",
  "Specialiteter",
  "Glutenfri fryser",
  "Festkager",
  "Kørsel",
  "Alle",
];

export default function Sidebar({ selectedCategory, onItemClick }) {
  const baseClasses =
    "block rounded-md px-3 py-2 text-sm font-medium text-left w-full transition";

  const activeCategory = selectedCategory || "Brød";

  return (
    <nav className="h-full flex flex-col gap-2 px-4 py-6 text-neutral-700">
      <div className="mb-4 px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Kategorier
      </div>

      <div className="flex flex-col gap-1">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;

          const href = `/products?category=${encodeURIComponent(category)}`;

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
    </nav>
  );
}
