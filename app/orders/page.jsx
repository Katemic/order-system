import { getAllOrders } from "@/lib/orders";
import { sortOrders, formatDate } from "@/lib/orderHelpers";
import OrdersPageClient from "@/components/OrdersPageClient";

export default async function OrdersPage() {
  let orders = await getAllOrders();
  orders = sortOrders(orders);

  orders = orders.map((order) => ({
    ...order,
    date_needed: formatDate(order.date_needed),
    date_created: formatDate(order.date_created),
  }));

  return <OrdersPageClient orders={orders} />;
}





