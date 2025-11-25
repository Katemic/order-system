// app/orders/page.jsx
import { getAllOrders } from "@/lib/orders";


function parseTimeToMinutes(value) {
  if (!value) return Infinity; // tomme tider sorteres sidst

  // Eksempel: "08:00-09:00" → "08:00"
  // Eksempel: "8-9" → "8"
  const start = value.split("-")[0].trim();

  // Hvis formatet er "08:00" eller "8:30"
  if (start.includes(":")) {
    const [h, m] = start.split(":").map(Number);
    return h * 60 + (m || 0);
  }

  // Hvis formatet er "8"
  const num = Number(start);
  if (!isNaN(num)) {
    return num * 60;
  }

  return Infinity; // fallback
}


function sortOrders(orders) {
  return orders.sort((a, b) => {
    // 1. Sorter efter dato
    const dateA = new Date(a.date_needed);
    const dateB = new Date(b.date_needed);
    if (dateA - dateB !== 0) return dateA - dateB;

    // 2. Hent tider (pickup eller delivery)
    const timeA =
      a.delivery_type === "delivery" ? a.delivery_time : a.pickup_time;
    const timeB =
      b.delivery_type === "delivery" ? b.delivery_time : b.pickup_time;

    // 3. Konverter til minutter siden midnat
    const minutesA = parseTimeToMinutes(timeA);
    const minutesB = parseTimeToMinutes(timeB);

    return minutesA - minutesB;
  });
}


function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("da-DK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function OrdersPage() {
  const orders = sortOrders(await getAllOrders());

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Bestillinger</h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Navn</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dato</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tidspunkt</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">antal produkter</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pris</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const isDelivery = order.delivery_type === "delivery";
              const time = isDelivery ? order.delivery_time : order.pickup_time;

              return (
                <tr
                  key={order.id}
                  className="border-b text-sm bg-white"
                >
                  <td className="px-4 py-3 whitespace-nowrap">{order.customer_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(order.date_needed)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{time || "—"}</td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {isDelivery ? (
                      <span className="text-red-600 font-medium">Levering</span>
                    ) : (
                      <span className="text-gray-700">Afhentning</span>
                    )}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.order_items.length}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.total_price} kr.
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


