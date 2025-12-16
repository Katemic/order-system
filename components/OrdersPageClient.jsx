"use client";

import { useSearchParams } from "next/navigation";
import OrdersTable from "@/components/OrdersTable";
import PrintOrdersButton from "@/components/PrintOrdersButton";
import { applyOrdersFilters } from "@/lib/orderFilters";

export default function OrdersPageClient({ orders }) {
  const params = useSearchParams();

  const filters = {
    search: params.get("search") || "",
    date: params.get("date") || "",
    from: params.get("from") || "",
    to: params.get("to") || "",
    fulfillment: params.get("fulfillment") || "",
    range: params.get("range") || "",
  };

  const filtered = applyOrdersFilters(orders, filters);

  return (
    <div className="p-6 pt-20">
      <div className="mb-4 flex justify-end">
        <PrintOrdersButton />
      </div>

      <OrdersTable orders={filtered} />
    </div>
  );
}
