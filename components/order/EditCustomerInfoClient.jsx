"use client";

import { useState } from "react";
import { useActionState } from "react";
import CustomerForm from "./CustomerForm";
import { updateOrderCustomerInfoAction } from "../../actions/order/updateOrderCustomerInfoAction";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

export default function EditCustomerInfoClient({ initialOrder }) {
  const [form, setForm] = useState({
    orderDate: initialOrder.date_needed ?? "",
    customerName: initialOrder.customer_name ?? "",
    phone: initialOrder.customer_phone ?? "",
    agreedPrice:
      initialOrder.agreed_price != null
        ? String(initialOrder.agreed_price)
        : "",
    orderedBy: initialOrder.taken_by ?? "",
    paid: !!initialOrder.paid,
    fulfillmentType: initialOrder.delivery_type ?? "pickup",
    pickupTime: initialOrder.pickup_time ?? "",
    address: initialOrder.delivery_address ?? "",
    zip: initialOrder.delivery_zip ?? "",
    deliveryTime: initialOrder.delivery_time ?? "",
    orderNote: initialOrder.note ?? "",
  });

  const [state, formAction, isPending] = useActionState(
    updateOrderCustomerInfoAction,
    initialState
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFulfillmentChange = (type) => {
    setForm((prev) => ({
      ...prev,
      fulfillmentType: type,
    }));
  };

  const isPickup = form.fulfillmentType === "pickup";
  const isDelivery = form.fulfillmentType === "delivery";

  const orderItems = [];
  const hasItems = true;

  return (
    <CustomerForm
      orderId={initialOrder.id}
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
  );
}
