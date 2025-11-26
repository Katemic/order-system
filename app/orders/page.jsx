import { getAllOrders } from "@/lib/orders";
import { sortOrders, formatDate } from "@/lib/orderHelpers";
import OrdersPageClient from "@/components/OrdersPageClient";

export default async function OrdersPage() {
  let orders = await getAllOrders();
  orders = sortOrders(orders);

orders = orders.map((order) => ({
  ...order,
  date_needed_raw: order.date_needed,            // original til filtering
  date_needed: formatDate(order.date_needed),    // formateret til UI
  date_created_raw: order.date_created,
  date_created: formatDate(order.date_created),
}));


  return <OrdersPageClient orders={orders} />;
}





