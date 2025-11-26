"use client";

import { useOrdersFilter } from "@/components/OrdersFilterContext";

export default function OrderFilterSidebar({ onItemClick }) {
  const {
    singleDate,
    fromDate,
    toDate,
    setSingleDate,
    setFromDate,
    setToDate,
    handleToday,
    handleAll,
  } = useOrdersFilter();

  const inputClasses =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm " +
    "bg-white shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 " +
    "hover:border-neutral-400 transition";

  return (
    <nav className="h-full flex flex-col px-4 py-6 text-neutral-700">

      <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Filtrer dato
      </div>

      {/* ENKELT DATO */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Vælg dato</label>
        <input
          type="date"
          value={singleDate}
          onChange={(e) => {
            setSingleDate(e.target.value);
            setFromDate("");
            setToDate("");
            onItemClick?.();
          }}
          className={inputClasses}
        />
      </div>

      {/* PERIODE */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Periode</label>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setSingleDate("");
            onItemClick?.();
          }}
          className={`${inputClasses} mb-2`}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setSingleDate("");
            onItemClick?.();
          }}
          className={inputClasses}
        />
      </div>

      {/* KNAPPER */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => {
            handleToday();
            onItemClick?.();
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-sm"
        >
          I dag
        </button>

        <button
          onClick={() => {
            handleAll();
            onItemClick?.();
          }}
          className="bg-neutral-200 px-4 py-2 rounded-lg hover:bg-neutral-300 transition shadow-sm"
        >
          Alle bestillinger
        </button>
      </div>

    </nav>
  );
}



