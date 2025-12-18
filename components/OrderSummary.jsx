"use client";

import { useRouter } from "next/navigation";

export default function OrderSummary({
  items,
  onReset,
  onEditItem,
  onRemoveItem,
  onProceed,
  showReset = true, // create-mode default
  proceedLabel,
}) {
  const router = useRouter();

  const total = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const handleDefaultProceed = () => {
    if (!items || items.length === 0) return;
    router.push("/createOrder/customerInfo");
  };

  const useProceed = onProceed || handleDefaultProceed;

  const buttonLabel = proceedLabel || (onProceed ? "Gem ændringer" : "Videre");

  return (
    <aside className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
      <h2 className="text-lg font-semibold mb-3">Bestilling</h2>

      <div className="flex-1 overflow-y-auto space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Ingen produkter i bestillingen endnu.
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="border-b border-neutral-200 pb-2 last:border-b-0 flex justify-between items-start gap-2 cursor-pointer"
            >
              {/*CLICK TO EDIT*/}
              <div
                className="flex-1 text-sm"
                onClick={() => onEditItem && onEditItem(index)}
              >
                <div className="flex justify-between font-medium text-neutral-900">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} kr.</span>
                </div>

                {/*NOTE*/}
                {item.note && (
                  <p className="mt-1 text-xs text-neutral-600 break-words">
                    Note: {item.note}
                  </p>
                )}

                {item.customizations &&
                  Object.keys(item.customizations).length > 0 && (
                    <div className="mt-1 text-xs text-neutral-600 space-y-1">
                      {Object.entries(item.customizations).map(
                        ([typeName, options]) => {
                          if (!Array.isArray(options) || options.length === 0)
                            return null;

                          const optionLabels = options
                            .map((opt) =>
                              typeof opt === "string"
                                ? opt
                                : typeof opt === "object" && opt !== null
                                ? opt.name ?? opt.id
                                : String(opt)
                            )
                            .join(", ");

                          return (
                            <p key={typeName}>
                              <span className="font-medium">{typeName}:</span>{" "}
                              {optionLabels}
                            </p>
                          );
                        }
                      )}
                    </div>
                  )}
              </div>

              {/*REMOVE ITEM*/}
              {onRemoveItem && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 text-lg leading-none px-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 border-t border-neutral-200 pt-4 space-y-3">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{total.toFixed(2)} kr.</span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={useProceed}
            disabled={items.length === 0}
            className={`flex-1 transition px-3 py-2 rounded-lg text-sm font-medium
              ${
                items.length === 0
                  ? "opacity-50 cursor-not-allowed bg-neutral-300 text-neutral-500 border border-neutral-300"
                  : "btn-primary"
              }`}
          >
            {buttonLabel}
          </button>

          {showReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Nulstil
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
