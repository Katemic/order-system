"use client";

import { useSearchParams } from "next/navigation";
import OrdersTable from "@/components/OrdersTable";

export default function OrdersPageClient({ orders }) {
  const params = useSearchParams();

  const search = (params.get("search") || "").toLowerCase().trim();
  const date = params.get("date") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const fulfillment = params.get("fulfillment") || "";
  const range = params.get("range") || ""; 

  const today = new Date().toISOString().slice(0, 10);
  const hasDateFilter = !!date || !!from || !!to;

  let filtered = orders;

  if (!hasDateFilter) {
    if (range === "old") {
      filtered = filtered.filter((o) => o.date_needed_raw < today);
    } else if (range === "all") {
    } else {
      filtered = filtered.filter((o) => o.date_needed_raw >= today);
    }
  }

  if (search) {
    filtered = filtered.filter((o) => {
      const customer = (o.customer_name || "").toLowerCase();

      const matchesCustomer = customer.includes(search);

      const matchesProduct = Array.isArray(o.order_items)
        ? o.order_items.some((item) =>
            (item.products?.name || "").toLowerCase().includes(search)
          )
        : false;

      return matchesCustomer || matchesProduct;
    });
  }

  if (date) {
    filtered = filtered.filter((o) => o.date_needed_raw === date);
  }

  if (!date && from && to) {
    filtered = filtered.filter(
      (o) => o.date_needed_raw >= from && o.date_needed_raw <= to
    );
  }

  if (fulfillment === "delivery") {
    filtered = filtered.filter((o) => o.delivery_type === "delivery");
  } else if (fulfillment === "pickup") {
    filtered = filtered.filter((o) => o.delivery_type === "pickup");
  }

  return (
    <div className="p-6">
      <OrdersTable orders={filtered} />
    </div>
  );
}
