"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PrintOrdersButton() {
  const router = useRouter();
  const params = useSearchParams();

  function handlePrint() {
    const qs = params.toString();
    router.push(qs ? `/orders/print?${qs}` : "/orders/print");
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
    >
      Print ordrer
    </button>
  );
}
