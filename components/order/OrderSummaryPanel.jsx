export default function OrderSummaryPanel({ orderItems, total, hasItems, errors }) {
  return (
    <section className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Din bestilling</h2>

      {!hasItems ? (
        <p className="text-sm text-neutral-500">
          Der er ingen produkter i bestillingen.
        </p>
      ) : (
        <>
          <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
            {orderItems.map((item, i) => (
              <div
                key={i}
                className="border-b border-neutral-200 pb-2 last:border-b-0"
              >
                <div className="flex justify-between text-sm font-medium">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} kr.</span>
                </div>

                {item.note && (
                  <p className="mt-1 text-xs text-neutral-600">
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

                          const labels = options
                            .map((opt) =>
                              typeof opt === "object" && opt !== null
                                ? opt.name ?? opt.id
                                : String(opt)
                            )
                            .join(", ");

                          return (
                            <p key={typeName}>
                              <span className="font-medium">{typeName}:</span>{" "}
                              {labels}
                            </p>
                          );
                        }
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold border-t border-neutral-200 pt-3">
            <span>Total</span>
            <span>{total.toFixed(2)} kr.</span>
          </div>

          {errors?.orderItems && (
            <p className="mt-2 text-sm text-red-600">{errors.orderItems}</p>
          )}
        </>
      )}
    </section>
  );
}
