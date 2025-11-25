"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderProductModal({ product, onClose, onAdd }) {
    const router = useRouter();

    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");

    const { name, price } = product;

    const handleAdd = () => {
        const qty = Number(quantity) || 1;

        if (onAdd) {
            onAdd({
                product,
                quantity: qty,
                note: note.trim(),
            });
        }

        if (onClose) onClose();
    };

    const handleCancel = () => {
        if (onClose) onClose();
        router.push("/createOrder");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col gap-5">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">{name}</h2>
                        {price != null && (
                            <p className="text-lg font-semibold text-neutral-800 mt-1">
                                {price} kr.
                            </p>
                        )}
                    </div>

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

                    <div className="mt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn-secondary"
                        >
                            Annuller
                        </button>

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="btn-primary"
                        >
                            Tilføj til ordre
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
