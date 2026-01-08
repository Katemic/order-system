"use client";

import { useState } from "react";

export default function OrderProductModal({
  product,
  onClose,
  onAdd,
  onConfirm,
  mode = "add",
  initialQuantity = 1,
  initialNote = "",
  initialCustomizations = {},
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [note, setNote] = useState(initialNote);
  const [selectedCustomizations, setSelectedCustomizations] = useState(
    initialCustomizations || {}
  );

  const { name, price, customizationOptions } = product;

  const handleToggleCustomization = (typeName, option) => {
    setSelectedCustomizations((prev) => {
      const prevForType = prev[typeName] || [];
      const isSelected = prevForType.some((o) => o.id === option.id);

      const nextForType = isSelected
        ? prevForType.filter((o) => o.id !== option.id)
        : [...prevForType, option];

      return {
        ...prev,
        [typeName]: nextForType,
      };
    });
  };

  const handleSubmit = () => {
    const qty = Number(quantity) || 1;
    const trimmedNote = note.trim();

    const payload = {
      quantity: qty,
      note: trimmedNote,
      customizations: selectedCustomizations,
    };

    if (mode === "edit" && onConfirm) {
      onConfirm(payload);
    } else if (onAdd) {
      onAdd({ product, ...payload });
    }

    onClose?.();
  };

  const handleCancel = () => {
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-5">
          {/*Header*/}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">{name}</h2>
            {price != null && (
              <p className="text-lg font-semibold text-neutral-800 mt-1">
                {price} kr.
              </p>
            )}
          </div>

          {/*Quantity*/}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="order-quantity"
              className="text-sm font-medium text-neutral-800"
            >
              Antal
            </label>
            <input
              id="order-quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-32 rounded-md border border-neutral-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/*Customizations*/}
          {customizationOptions && Object.keys(customizationOptions).length > 0 && (
            <details className="group border border-neutral-300 rounded-lg px-4 py-3 bg-neutral-50 shadow-sm">
              <summary className="cursor-pointer list-none flex justify-between items-center font-medium text-sm text-neutral-800 hover:text-neutral-900">
                <span>Tilpasninger (valgfrit)</span>
                <span className="transition-transform group-open:rotate-90 text-neutral-500">
                  ▶
                </span>
              </summary>

              <div className="mt-3 flex flex-col gap-4 max-h-64 overflow-y-auto pr-1">
                {Object.entries(customizationOptions).map(([typeName, options]) => (
                  <div
                    key={typeName}
                    className="border rounded-md p-3 bg-neutral-50"
                  >
                    <p className="text-neutral-900 text-base font-semibold mb-2">
                      {typeName}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {options.map((opt) => {
                        const isChecked = selectedCustomizations[typeName]?.some(
                          (o) => o.id === opt.id
                        );

                        return (
                          <label
                            key={opt.id}
                            className="inline-flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={!!isChecked}
                              onChange={() => handleToggleCustomization(typeName, opt)}
                              className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-neutral-700 text-sm">
                              {opt.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/*Note*/}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="order-note"
              className="text-sm font-medium text-neutral-800"
            >
              Note (valgfri)
            </label>
            <textarea
              id="order-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Fx skæres ud, leveres koldt, uden nødder..."
            />
          </div>

          {/*Buttons*/}
          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Annuller
            </button>

            <button type="button" onClick={handleSubmit} className="btn-primary">
              {mode === "edit" ? "Gem ændringer" : "Tilføj til ordre"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
