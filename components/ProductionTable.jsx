"use client";

import ProductionRow from "./ProductionRow";
import { PRODUCT_CATEGORIES } from "@/lib/categories";

export default function ProductionTable({ rows }) {
  if (!rows || rows.length === 0) {
    return <p className="text-neutral-500">Ingen produktion i perioden.</p>;
  }

  // Gruppér rækker efter produktkategori
  const groupedByCategory = rows.reduce((acc, row) => {
    const category =
      row.productCategory ||
      row.category ||
      row.products?.category ||
      "Ukategoriseret";

    acc[category] ??= [];
    acc[category].push(row);
    return acc;
  }, {});

  const orderedCategories = [
    ...PRODUCT_CATEGORIES,
    ...(groupedByCategory["Ukategoriseret"] ? ["Ukategoriseret"] : []),
  ];

  return (
    <div className="space-y-10 p-3">
      {orderedCategories.map((category) => {
        const categoryRows = groupedByCategory[category];
        if (!categoryRows || categoryRows.length === 0) return null;

        return (
          <section key={category}>
            {/* KATEGORI OVERSKRIFT */}
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              {category}
            </h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-20">
                      Antal
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Produkt
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-40">
                      Tidligst klar
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categoryRows.map((row, index) => (
                    <ProductionRow
                      key={`${category}-${row.productName}-${index}`}
                      row={row}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}




