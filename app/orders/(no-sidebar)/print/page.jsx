// app/orders/print/page.jsx
import { getAllOrders } from "@/lib/orders";
import { sortOrders, formatDate } from "@/lib/orderHelpers";
import { applyOrdersFilters } from "@/lib/orderFilters";
import OrdersPrintView from "@/components/OrdersPrintView";
import PrintAuto from "@/components/PrintAuto";

export const dynamic = "force-dynamic";

export default async function OrdersPrintPage({ searchParams }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  let orders = await getAllOrders();
  orders = sortOrders(orders);

  // samme mapping som /orders
  orders = orders.map((order) => ({
    ...order,
    date_needed_raw: order.date_needed,
    date_needed: formatDate(order.date_needed),
    date_created_raw: order.date_created,
    date_created: formatDate(order.date_created),
  }));

  const filtered = applyOrdersFilters(orders, resolvedSearchParams);

  return (
    <main className="p-0">
      <PrintAuto />
      <OrdersPrintView orders={filtered} />
    </main>
  );
}
