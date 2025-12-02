"use client";

import { useSearchParams } from "next/navigation";
import OrdersTable from "@/components/OrdersTable";

export default function OrdersPageClient({ orders }) {
  const params = useSearchParams();

  const search = (params.get("search") || "").toLowerCase().trim();
  const date = params.get("date") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  let filtered = orders;

  // 🔍 SEARCH
  if (search) {
    filtered = filtered.filter((o) => {
      const customer = o.customer_name.toLowerCase();
      const matchesCustomer = customer.includes(search);

      const matchesProduct = o.order_items.some((item) =>
        item.products.name.toLowerCase().includes(search)
      );

      return matchesCustomer || matchesProduct;
    });
  }

  // 📅 SINGLE DATE
  if (date) {
    filtered = filtered.filter((o) => o.date_needed_raw === date);
  }

  // 📆 RANGE
  if (!date && from && to) {
    filtered = filtered.filter(
      (o) => o.date_needed_raw >= from && o.date_needed_raw <= to
    );
  }

  return (
    <div className="p-6">
      <OrdersTable orders={filtered} />
    </div>
  );
}





