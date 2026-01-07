"use client";

import { useSearchParams } from "next/navigation";
import { formatDateWithWeekday } from "@/lib/helpers/dateHelpers";
import PrintProductionButton from "@/components/PrintProductionButton";

export default function ProductionHeader({ showPrint = true }) {
  const params = useSearchParams();

  const date = params.get("date");
  const from = params.get("from");
  const to = params.get("to");
  const production = params.get("production");

  const todayStr = new Date().toISOString().slice(0, 10);

  let dateLabel = "";

  if (date) {
    dateLabel = formatDateWithWeekday(date);
  } else if (from && to) {
    dateLabel = `${formatDateWithWeekday(from)} – ${formatDateWithWeekday(to)}`;
  } else {
    dateLabel = formatDateWithWeekday(todayStr);
  }

  const productionLabel = production || "Alle produktioner";

  return (
    <div className="mb-5 pl-3 pr-3">
      {/* TITLE + PRINT */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="page-title">
          Produktionsliste
        </h1>

        {showPrint && <PrintProductionButton />}
      </div>

      {/* date + category */}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-base font-semibold text-neutral-800">
          {dateLabel}
        </span>

        <span className="text-neutral-400">•</span>

        <span className="text-base font-medium text-neutral-700">
          {productionLabel}
        </span>
      </div>

      <div className="mt-3 border-b border-neutral-300" />
    </div>
  );
}


