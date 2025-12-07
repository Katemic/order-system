"use client";

import { useSearchParams, useRouter } from "next/navigation";
import DateInput from "@/components/DateInput";

export default function OrderFilterSidebar({ onItemClick }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const date = searchParams.get("date") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const fulfillment = searchParams.get("fulfillment") || "";
  const range = searchParams.get("range") || "";

  const isDeliveryOnly = fulfillment === "delivery";

  const inputClasses =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm " +
    "bg-white shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 " +
    "hover:border-neutral-400 transition";

  const todayStr = new Date().toISOString().slice(0, 10);
  const hasDateFilter = !!date || !!from || !!to;

  const isTodaySelected =
    (!from && !to && date === todayStr) ||
    (!date && !from && !to && !range);

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

  function handleToggleDelivery(checked) {
    update({
      fulfillment: checked ? "delivery" : null,
    });
  }

  function handleToday() {
    const today = new Date().toISOString().slice(0, 10);

    update({
      date: today,
      from: null,
      to: null,
      range: null,
    });
  }

  function handleDateChange(value) {
    update({
      date: value,
      from: null,
      to: null,
      range: null,
    });
  }

  function handleFromChange(value) {
    update({
      from: value,
      to,
      date: null,
      range: null,
    });
  }

  function handleToChange(value) {
    update({
      from,
      to: value,
      date: null,
      range: null,
    });
  }

  function setRange(value) {
    update({
      range: value,
      search: null,
      date: null,
      from: null,
      to: null,
    });
  }

  return (
    <nav className="h-full flex flex-col px-4 py-6 text-neutral-700">
      {/* SØGNING */}
      <form
        action="/orders"
        method="GET"
        onSubmit={onItemClick}
        className="mb-6 grid grid-cols-[1fr_auto] gap-2"
      >
        {/* Bevar range når man søger, så man kan søge i gamle/nye */}
        <input type="hidden" name="range" value={range} />

        <input
          key={search || "empty"}
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

      {/* DATO-FILTER */}
      <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Filtrer dato
      </div>

      {/* ENKELT DATO */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Vælg dato</label>
        <DateInput
          prefix="date"
          value={date}
          onCommit={handleDateChange}
          className={inputClasses}
        />
      </div>

      {/* PERIODE */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Periode</label>

        <DateInput
          prefix="from"
          value={from}
          onCommit={handleFromChange}
          className={`${inputClasses} mb-2`}
        />

        <DateInput
          prefix="to"
          value={to}
          onCommit={handleToChange}
          className={inputClasses}
        />
      </div>

      {/* KUN LEVERINGER */}
      <label className="inline-flex items-center gap-2 text-sm mt-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isDeliveryOnly}
          onChange={(e) => handleToggleDelivery(e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span>Kun leveringer</span>
      </label>

      {/* ACTION-KNAPPER + RANGE */}
      <div className="mt-auto flex flex-col gap-3">
        <button
          type="button"
          onClick={handleToday}
          className={
            isTodaySelected
              ? "bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm"
              : "bg-neutral-200 text-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-300 transition shadow-sm"
          }
        >
          I dag
        </button>

        <button
          type="button"
          onClick={() => setRange("new")}
          className={
            !hasDateFilter && range === "new"
              ? "bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm"
              : "bg-neutral-200 px-4 py-2 rounded-lg hover:bg-neutral-300 transition shadow-sm"
          }
        >
          Fremtidige bestillinger
        </button>

        <button
          type="button"
          onClick={() => setRange("old")}
          className={
            !hasDateFilter && range === "old"
              ? "bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm"
              : "bg-neutral-200 px-4 py-2 rounded-lg hover:bg-neutral-300 transition shadow-sm"
          }
        >
          Gamle bestillinger
        </button>

        <button
          type="button"
          onClick={() => setRange("all")}
          className={
            !hasDateFilter && range === "all"
              ? "bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm"
              : "bg-neutral-200 px-4 py-2 rounded-lg hover:bg-neutral-300 transition shadow-sm"
          }
        >
          Alle bestillinger
        </button>
      </div>
    </nav>
  );
}
