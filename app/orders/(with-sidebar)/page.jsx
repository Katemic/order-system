import { getAllOrders } from "@/lib/orders";
import { sortOrders, formatDate } from "@/lib/orderHelpers";
import OrdersPageClient from "@/components/OrdersPageClient";
import NotificationBanner from "@/components/NotificationBanner";

export default async function OrdersPage() {
  let orders = await getAllOrders();
  orders = sortOrders(orders);

  orders = orders.map((order) => ({
    ...order,
    date_needed_raw: order.date_needed,
    date_needed: formatDate(order.date_needed),
    date_created_raw: order.date_created,
    date_created: formatDate(order.date_created),
  }));

  return (
    <>
      <OrdersPageClient orders={orders} />
      <NotificationBanner />
    </>
  );
}
