"use client";

import { useState } from "react";
import OrderDetailModal from "./OrderDetailModal";

export default function OrdersTable({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <>
      <div className="p-3">

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Navn</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dato</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tidspunkt</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Antal produkter</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pris</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Betalt</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const isDelivery = order.delivery_type === "delivery";
                const time = isDelivery ? order.delivery_time : order.pickup_time;

                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`border-b text-sm cursor-pointer hover:bg-neutral-100
    ${order.delivery_type === "delivery"
                        ? "bg-red-50"
                        : "bg-white"
                      }
  `}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{order.customer_name}</td>

                    {/* Dato er allerede formateret server-side */}
                    <td className="px-4 py-3 whitespace-nowrap">{order.date_needed}</td>

                    {/* Tidspunkt */}
                    <td className="px-4 py-3 whitespace-nowrap">{time || "—"}</td>

                    {/* Type */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isDelivery ? (
                        <span className="text-red-600 font-medium">Levering</span>
                      ) : (
                        <span className="text-gray-700">Afhentning</span>
                      )}
                    </td>

                    {/* Antal produkter */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {order.order_items.length}
                    </td>

                    {/* Pris */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {order.total_price} kr.
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {order.paid ? (
                        <span className="text-emerald-600">✔️</span>
                      ) : (
                        <span className="text-red-600">❌</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}

