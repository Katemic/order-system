"use client";

import Link from "next/link";

export default function CustomizationsTable({ customizations, onDeleteClick }) {
  if (!customizations || customizations.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Der er ingen tilpasninger endnu.
      </p>
    );
  }

  return (
    <table className="min-w-full border border-neutral-200 bg-white text-sm">
      <thead className="bg-neutral-50 border-b border-neutral-200">
        <tr>
          <th className="px-4 py-2 text-left font-semibold text-neutral-800">
            Kategori
          </th>
        </tr>
      </thead>

      <tbody>
        {customizations.map((type) => (
          <tr key={type.id} className="border-b border-neutral-200">
            <td className="p-0">
              <details className="group">
                <summary
                  className="cursor-pointer list-none px-4 py-3 flex items-center justify-between 
                             hover:bg-neutral-100 select-none"
                >
                  <span className="font-medium text-neutral-900">
                    {type.name}
                  </span>

                  <span className="text-neutral-500 transition-transform group-open:rotate-90">
                    ▶
                  </span>
                </summary>

                <div className="px-8 pb-4 pt-2">
                  {type.options.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 list-disc list-inside">
                      {type.options.map((opt) => (
                        <li key={opt.id} className="text-neutral-700 text-sm">
                          {opt.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-neutral-500 text-sm">
                      Ingen valgmuligheder tilknyttet endnu.
                    </p>
                  )}

                  <div className="flex justify-end gap-2 mt-3">
                    <Link
                      href={`/customizations/${type.id}/edit`}
                      className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 text-sm"
                    >
                      Rediger
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteClick({ id: type.id, name: type.name });
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Slet
                    </button>
                  </div>
                </div>
              </details>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
