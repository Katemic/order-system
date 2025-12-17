"use client";

export default function ProductionRow({ row }) {
  return (
    <tr className="border-b text-sm align-top hover:bg-neutral-50">
      {/* ANTAL */}
      <td className="px-4 py-3 font-medium whitespace-nowrap">
        {row.quantity}
      </td>

      {/* PRODUKT + CUSTOMIZATIONS + NOTE */}
      <td className="px-4 py-3">
        <div className="font-medium text-neutral-900">
          {row.productName}
        </div>

        {/* CUSTOMIZATIONS */}
        {row.customizations && (
          <div className="mt-1 text-xs text-neutral-600 space-y-0.5">
            {Object.entries(row.customizations).map(([type, opts]) => (
              <div key={type}>
                <span className="font-medium">{type}:</span>{" "}
                {opts.map(o => o.name).join(", ")}
              </div>
            ))}
          </div>
        )}

        {/* NOTE */}
        {row.note && (
          <div className="mt-1 text-xs">
            <span className="font-medium">Note:</span> {row.note}
          </div>
        )}
      </td>

      {/* TIDLIGST KLAR */}
      <td className="px-4 py-3 whitespace-nowrap">
        {row.earliestReady ? `kl ${row.earliestReady}` : "—"}

        {/* TIDLIG PRODUKTION */}
        {row.earlyProduction && (
          <div className="mt-1 text-xs text-neutral-600">
            {row.earlyProduction
              .map(p => `${p.quantity} stk kl ${p.time}`)
              .join(", ")}
          </div>
        )}
      </td>
    </tr>
  );
}







