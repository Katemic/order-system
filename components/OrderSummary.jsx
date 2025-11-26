"use client";

export default function OrderSummary({ items, onReset }) {
    const total = items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
    );

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
                            className="border-b border-neutral-200 pb-2 last:border-b-0"
                        >
                            <div className="flex justify-between text-sm font-medium text-neutral-900">
                                <span>
                                    {item.quantity}x {item.name}
                                </span>
                                <span>
                                    {(item.price * item.quantity).toFixed(2)} kr.
                                </span>
                            </div>
                            {item.note && (
                                <p className="mt-1 text-xs text-neutral-600 break-words">
                                    Note: {item.note}
                                </p>
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
                    <button type="button" className="flex-1 btn-primary">
                        Videre
                    </button>
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                        Nulstil
                    </button>
                </div>
            </div>
        </aside>
    );
}
