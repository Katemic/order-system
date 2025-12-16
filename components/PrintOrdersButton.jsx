"use client";

import { useSearchParams } from "next/navigation";

export default function PrintOrdersButton() {
  const params = useSearchParams();

  function handlePrint() {
    const qs = params.toString();
    const url = qs ? `/orders/print?${qs}` : "/orders/print";

    window.open(url, "_blank");
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
    >
      Print viste ordrer
    </button>
  );
}
