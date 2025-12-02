"use client";

import { useOrdersFilter } from "@/components/OrdersFilterContext";
import OrdersTable from "@/components/OrdersTable";
import { useSearchParams } from "next/navigation";


export default function OrdersPageClient({ orders }) {
  const { singleDate, fromDate, toDate } = useOrdersFilter();
  const searchParams = useSearchParams();
  const searchTerm = (searchParams.get("search") || "").toLowerCase().trim();

  const filtered = orders
    // 1. dato
    .filter((o) => {
      const date = o.date_needed_raw;

      if (singleDate) return date === singleDate;
      if (fromDate && toDate) return date >= fromDate && date <= toDate;

      return true;
    })

    // 2. søgning (navn + produkter)
    .filter((o) => {
      if (!searchTerm) return true;

      const matchesName = o.customer_name.toLowerCase().includes(searchTerm);

      const matchesProduct = o.order_items.some((item) =>
        item.products.name.toLowerCase().includes(searchTerm)
      );

      return matchesName || matchesProduct;
    });


  return (
    <div className="p-6">
      <OrdersTable orders={filtered} />
    </div>
  );
}




