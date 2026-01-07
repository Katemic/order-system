"use client";
import Link from "next/link";

import DeleteConfirmModal from "./system/DeleteConfirmModal";
import { useState } from "react";

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  const isDelivery = order.delivery_type === "delivery";
  const typeLabel = isDelivery ? "Levering:" : "Afhentning:";
  const time = isDelivery ? order.delivery_time : order.pickup_time;
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/*Close-button*/}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl"
          aria-label="Luk"
        >
          ✕
        </button>

        {/*Title*/}
        <h2 className="text-2xl font-bold mb-1">
          Bestilling #{order.id}
        </h2>
        <p className="text-neutral-500 text-sm mb-6">
          Betjent af {order.taken_by} den {order.date_created}
        </p>

        {/*GRID*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/*LEFT – PRODUCTS*/}
          <div>
            <h3 className="text-lg font-semibold mb-2">Produkter</h3>

            <div className="border rounded-lg divide-y max-h-110 overflow-y-auto">
              {order.order_items.map((item, i) => (
                <div key={i} className="p-3 text-sm">
                  <div className="flex justify-between">
                    <span>{item.products?.name || "Ukendt produkt"}</span>
                    <span>
                      {item.quantity} stk —{" "}
                      {(item.quantity * (item.products?.price ?? 0))} kr.
                    </span>
                  </div>

                  {/*NOTE ON LINE*/}
                  {item.item_note && (
                    <p className="text-neutral-600 text-xs mt-1">
                      Note: {item.item_note}
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
                                <span className="font-medium">
                                  {typeName}:
                                </span>{" "}
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

            <Link
              href={`/orders/${order.id}/editProducts`}
              className="block w-full mt-4 px-4 py-3 rounded-lg 
             bg-emerald-600 text-white text-sm font-medium 
             hover:bg-emerald-700 transition text-center"
            >
              Redigér produkter
            </Link>
          </div>

          {/*RIGHT – CUSTOMER INFO*/}
          <div>
            <h3 className="text-lg font-semibold mb-2">Kunde</h3>

            <p><strong>Navn:</strong> {order.customer_name}</p>

            {order.customer_phone && (
              <p><strong>Telefon:</strong> {order.customer_phone}</p>
            )}

            <h3
              className={`text-lg font-semibold mt-4 mb-1 ${isDelivery ? "text-red-600" : ""
                }`}
            >
              {typeLabel}
            </h3>

            <p><strong>Tidspunkt:</strong> {time || "—"}</p>

            {isDelivery && (
              <>
                <p><strong>Adresse:</strong> {order.delivery_address || "—"}</p>
                <p><strong>Postnr:</strong> {order.delivery_zip || "—"}</p>
              </>
            )}

            {order.note && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-1">Note</h3>
                <p className="text-neutral-700 whitespace-pre-wrap">
                  {order.note}
                </p>
              </div>
            )}

            <p className="mt-4">
              <strong>Betalt:</strong>{" "}
              {order.paid ? "✔️" : "❌"}
            </p>

            <p className="mt-2">
              <strong>I alt:</strong> {order.total_price} kr.
            </p>

            <Link
              href={`/orders/${order.id}/editCustomerInfo`}
              className="block w-full mt-4 px-4 py-3 rounded-lg 
             bg-emerald-600 text-white text-sm font-medium 
             hover:bg-emerald-700 transition text-center"
            >
              Redigér kundeoplysninger
            </Link>

            {/*DELETE BUTTON*/}
            <button
              onClick={() => setShowDelete(true)}
              className="block w-full mt-4 px-4 py-3 rounded-lg 
             bg-red-600 text-white text-sm font-medium 
             hover:bg-red-700 transition"
            >
              Slet bestilling
            </button>
          </div>
        </div>
      </div>

      {showDelete && (
        <DeleteConfirmModal
          item={order}
          type="order"
          onClose={() => setShowDelete(false)}
          onDeleteComplete={onClose}
        />
      )}
    </div>
  );
}
