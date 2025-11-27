"use client";

import { createContext, useContext, useState } from "react";

const OrdersFilterContext = createContext(null);

export function OrdersFilterProvider({ children }) {
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

  return (
    <OrdersFilterContext.Provider
      value={{
        singleDate,
        fromDate,
        toDate,
        setSingleDate,
        setFromDate,
        setToDate,
        handleToday,
        handleAll,
      }}
    >
      {children}
    </OrdersFilterContext.Provider>
  );
}

export function useOrdersFilter() {
  return useContext(OrdersFilterContext);
}
