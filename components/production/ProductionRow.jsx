"use client";

import { parseTimeToMinutes } from "@/lib/helpers/orderHelpers";

export default function ProductionRow({ row }) {
  const EARLY_LIMIT_MINUTES = 7 * 60; // 07:00

  const isEarly =
    row.earliestReady &&
    parseTimeToMinutes(row.earliestReady) <= EARLY_LIMIT_MINUTES;

  return (
    <tr
      className="border-b text-sm align-top hover:bg-neutral-50"
    >
      {/* quantity */}
      <td className="px-4 py-3 font-medium whitespace-nowrap">
        {row.quantity}
      </td>

      {/* Product */}
      <td className="px-4 py-3">
        <div className="font-medium text-neutral-900">
          {row.productName}
        </div>

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

        {row.note && (
          <div className="mt-1 text-xs">
            <span className="font-medium">Note:</span> {row.note}
          </div>
        )}
      </td>

      {/* earliest ready */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={isEarly ? "font-semibold text-amber-700" : ""}>
          {row.earliestReady ? `kl ${row.earliestReady}` : "—"}
        </span>

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









