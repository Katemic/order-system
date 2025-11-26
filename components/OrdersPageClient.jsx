"use client";

import { useState, useMemo } from "react";
import OrdersTable from "@/components/OrdersTable";

export default function OrdersPageClient({ orders }) {
  const [singleDate, setSingleDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  function handleToday() {
    setSingleDate(today);
    setFromDate("");
    setToDate("");
  }

  function handleAll() {
    setSingleDate("");
    setFromDate("");
    setToDate("");
  }

  const filteredOrders = useMemo(() => {
    if (!singleDate && !fromDate && !toDate) return orders;

    if (singleDate) {
      return orders.filter((o) => o.date_needed === singleDate);
    }

    if (fromDate && toDate) {
      return orders.filter(
        (o) => o.date_needed >= fromDate && o.date_needed <= toDate
      );
    }

    return orders;
  }, [orders, singleDate, fromDate, toDate]);

  // sidebar triggers sendes via context (kommer om lidt)
  return (
    <div className="p-6">
      <OrdersTable orders={filteredOrders} />
    </div>
  );
}



