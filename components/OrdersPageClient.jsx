"use client";

import { useOrdersFilter } from "@/components/OrdersFilterContext";
import OrdersTable from "@/components/OrdersTable";

export default function OrdersPageClient({ orders }) {
  const { singleDate, fromDate, toDate } = useOrdersFilter();

const filtered = orders.filter((o) => {
  const date = o.date_needed_raw; // rå dato fra DB: yyyy-mm-dd

  if (singleDate) return date === singleDate;

  if (fromDate && toDate)
    return date >= fromDate && date <= toDate;

  return true;
});

  return (
    <div className="p-6">
      <OrdersTable orders={filtered} />
    </div>
  );
}




