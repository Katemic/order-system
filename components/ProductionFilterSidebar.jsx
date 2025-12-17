"use client";

import { useSearchParams, useRouter } from "next/navigation";
import DateInput from "@/components/DateInput";

export default function ProductionSidebar({ onItemClick }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const date = searchParams.get("date") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const production = searchParams.get("production") || "";

  const todayStr = new Date().toISOString().slice(0, 10);
  const hasDateFilter = !!date || !!from || !!to;

  const isTodaySelected =
    (!from && !to && date === todayStr) ||
    (!date && !from && !to);

  const inputClasses =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm " +
    "bg-white shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 " +
    "hover:border-neutral-400 transition";

  function update(params) {
    const url = new URL(window.location.href);

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });

    router.push(url.toString(), { scroll: false });
    onItemClick?.();
  }

  function handleToday() {
    update({
      date: todayStr,
      from: null,
      to: null,
    });
  }

  function handleDateChange(value) {
    update({
      date: value,
      from: null,
      to: null,
    });
  }

  function handleFromChange(value) {
    update({
      from: value,
      to,
      date: null,
    });
  }

  function handleToChange(value) {
    update({
      from,
      to: value,
      date: null,
    });
  }

  return (
    <nav className="h-full flex flex-col px-4 py-6 text-neutral-700">
      <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Filtrer produktion
      </div>

      {/* ENKELT DATO */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Vælg dato
        </label>

        <DateInput
          key={`date-${date}`}
          prefix="date"
          value={date}
          onCommit={handleDateChange}
          className={inputClasses}
        />
      </div>

      {/* PERIODE */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Periode
        </label>

        <DateInput
          key={`from-${from}`}
          prefix="from"
          value={from}
          onCommit={handleFromChange}
          className={`${inputClasses} mb-2`}
        />

        <DateInput
          key={`to-${to}`}
          prefix="to"
          value={to}
          onCommit={handleToChange}
          className={inputClasses}
        />
      </div>

      {/* PRODUKTIONSKATEGORI */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Produktionskategori
        </label>

        <select
          className={inputClasses}
          value={production}
          onChange={(e) =>
            update({ production: e.target.value || null })
          }
        >
          <option value="">Alle</option>
          <option value="Bager">Bager</option>
          <option value="Konditor">Konditor</option>
        </select>
      </div>

      {/* I DAG-KNAP */}
      <div className="mt-auto">
        <button
          type="button"
          onClick={handleToday}
          className={
            isTodaySelected
              ? "w-full bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm"
              : "w-full bg-neutral-200 text-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-300 transition shadow-sm"
          }
        >
          I dag
        </button>
      </div>
    </nav>
  );
}



