"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function OrderFilterSidebar({ onItemClick }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const date = searchParams.get("date") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const inputClasses =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm " +
    "bg-white shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 " +
    "hover:border-neutral-400 transition";

  // Helper to update URL
  function update(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    router.push(url.toString(), { scroll: false });
    onItemClick?.();
  }

  // Today
function handleToday() {
  const today = new Date().toISOString().slice(0, 10);

  update({
    date: today,
    from: null,
    to: null,
    search: null,   // ← NULSTIL SØGNINGEN
  });
}

  // Select single date
  function handleDateChange(value) {
    update({
      date: value,
      from: null,
      to: null,
    });
  }

  // Select period
  function handleFromChange(value) {
    update({
      from: value,
      to: to, // keep existing
      date: null,
    });
  }

  function handleToChange(value) {
    update({
      from: from, // keep existing
      to: value,
      date: null,
    });
  }

  return (
    <nav className="h-full flex flex-col px-4 py-6 text-neutral-700">

      {/* 🔍 Søgefelt — samme style som produkter */}
      <form
        action="/orders"
        method="GET"
        onSubmit={onItemClick}
        className="mb-6 grid grid-cols-[1fr_auto] gap-2"
      >
        <input
          type="text"
          name="search"
          placeholder="Søg bestillinger…"
          defaultValue={search}
          className={inputClasses}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium rounded-md 
                     bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Søg
        </button>
      </form>

      {/* 📅 DATO-FILTER */}
      <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Filtrer dato
      </div>

      {/* ENKELT DATO (AUTO FILTER) */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Vælg dato</label>
        <input
          type="date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* PERIODE (AUTO FILTER) */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Periode</label>

        <input
          type="date"
          value={from}
          onChange={(e) => handleFromChange(e.target.value)}
          className={`${inputClasses} mb-2`}
        />

        <input
          type="date"
          value={to}
          onChange={(e) => handleToChange(e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* ACTION-KNAPPER */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={handleToday}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-sm"
        >
          I dag
        </button>

        <button
          onClick={() => router.push("/orders")}
          className="bg-neutral-200 px-4 py-2 rounded-lg hover:bg-neutral-300 transition shadow-sm"
        >
          Alle bestillinger
        </button>
      </div>
    </nav>
  );
}






