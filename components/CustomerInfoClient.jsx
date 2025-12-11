"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import { submitOrderAction } from "../actions/submitOrderAction";
import OrderSummaryPanel from "./OrderSummaryPanel";
import CustomerForm from "./CustomerForm";

const initialState = {
  success: false,
  message: "",
  errors: {},
  values: null,
};

export default function CustomerInfoClient() {
  const [orderItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem("orderItems");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Kunne ikke læse orderItems:", err);
      return [];
    }
  });

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [state, formAction, isPending] = useActionState(
    submitOrderAction,
    initialState
  );

  const [form, setForm] = useState({
    orderDate: "",
    customerName: "",
    phone: "",
    agreedPrice: "",
    orderedBy: "",
    paid: false,
    fulfillmentType: "pickup",
    pickupTime: "",
    address: "",
    zip: "",
    deliveryTime: "",
    orderNote: "",
  });

  useEffect(() => {
    if (state && !state.success && state.values) {
      setForm((prev) => ({
        ...prev,
        ...state.values,
      }));
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFulfillmentChange = (type) => {
    setForm((prev) => ({ ...prev, fulfillmentType: type }));
  };

  const isPickup = form.fulfillmentType === "pickup";
  const isDelivery = form.fulfillmentType === "delivery";

  const hasItems = orderItems.length > 0;

  useEffect(() => {
    if (state?.success) {
      try {
        window.localStorage.removeItem("orderItems");
      } catch (err) {
        console.error("Kunne ikke fjerne orderItems:", err);
      }
    }
  }, [state]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/createOrder"
          className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md 
                     border border-neutral-300 hover:bg-neutral-100 
                     text-neutral-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Tilbage
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_3fr] items-start">
        <OrderSummaryPanel
          orderItems={orderItems}
          total={total}
          hasItems={hasItems}
          errors={state?.errors}
        />
        <CustomerForm
          form={form}
          onChange={handleChange}
          onCheckboxChange={handleCheckboxChange}
          onFulfillmentChange={handleFulfillmentChange}
          isPickup={isPickup}
          isDelivery={isDelivery}
          state={state}
          isPending={isPending}
          formAction={formAction}
          orderItems={orderItems}
          hasItems={hasItems}
        />
      </div>
    </div>
  );
}
