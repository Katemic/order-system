import { getAllOrders } from "@/lib/orders";
import { sortOrders, formatDate } from "@/lib/orderHelpers";
import OrdersTable from "@/components/OrdersTable";

export default async function OrdersPage() {
  let orders = await getAllOrders();

  // SORT SERVER-SIDE
  orders = sortOrders(orders);

  // FORMATTER DATO SERVER-SIDE
  orders = orders.map((order) => ({
    ...order,
    date_needed: formatDate(order.date_needed),
    date_created: formatDate(order.date_created),
  }));

  return <OrdersTable orders={orders} />;
}



