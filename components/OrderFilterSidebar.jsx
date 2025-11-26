"use client";

export default function OrderFilterSidebar({
  singleDate,
  setSingleDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onToday,
  onAll,
  onItemClick,
}) {
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
          }}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
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
          }}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm mb-2"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setSingleDate("");
          }}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {/* HURTIGE KNAPPER */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => {
            onToday();
            onItemClick?.();
          }}
          className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          I dag
        </button>

        <button
          onClick={() => {
            onAll();
            onItemClick?.();
          }}
          className="w-full px-4 py-2 bg-neutral-200 rounded-lg hover:bg-neutral-300 transition"
        >
          Alle bestillinger
        </button>
      </div>
    </nav>
  );
}

