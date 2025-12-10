"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createOrderWithItems } from "@/lib/orders";

export async function submitOrderAction(prevState, formData) {
  const errors = {};

  // REGEX til tid: fx "14", "14.00", "14:00", "14-16", "12-14.30"
  const timeRegex = /^\s*\d{1,2}([.:]\d{2})?(\s*-\s*\d{1,2}([.:]\d{2})?)?\s*$/;

  const orderDate = formData.get("orderDate")?.toString().trim() || "";
  const customerName = formData.get("customerName")?.toString().trim() || "";
  const phone = formData.get("phone")?.toString().trim() || "";
  const agreedPriceRaw = formData.get("agreedPrice")?.toString().trim() || "";
  const orderedBy = formData.get("orderedBy")?.toString().trim() || "";
  const paidRaw = formData.get("paid");
  const fulfillmentType =
    formData.get("fulfillmentType")?.toString() || "pickup";
  const pickupTime = formData.get("pickupTime")?.toString().trim() || "";
  const address = formData.get("address")?.toString().trim() || "";
  const zip = formData.get("zip")?.toString().trim() || "";
  const deliveryTime = formData.get("deliveryTime")?.toString().trim() || "";
  const orderNote = formData.get("orderNote")?.toString().trim() || "";

  const orderItemsRaw = formData.get("orderItems")?.toString() || "[]";
  const paid = paidRaw === "on";

  let orderItems = [];
  try {
    const parsed = JSON.parse(orderItemsRaw);
    if (Array.isArray(parsed)) {
      orderItems = parsed;
    } else {
      errors.orderItems = "Ordrelisten er ugyldig.";
    }
  } catch (err) {
    errors.orderItems = "Ordrelisten kunne ikke læses.";
  }

  if (!orderDate) {
    errors.orderDate = "Dato for bestilling er påkrævet.";
  } else {
    const chosenDate = new Date(orderDate);
    if (isNaN(chosenDate.getTime())) {
      errors.orderDate = "Dato for bestilling er ugyldig.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      chosenDate.setHours(0, 0, 0, 0);

      if (chosenDate < today) {
        errors.orderDate =
          "Dato for bestilling kan ikke ligge før dags dato.";
      }
    }
  }

  if (!customerName) {
    errors.customerName = "Navn på kunde er påkrævet.";
  }

  if (!orderedBy) {
    errors.orderedBy = "Bestilt af er påkrævet.";
  }

  if (!orderItems || orderItems.length === 0) {
    errors.orderItems = "Der skal mindst være ét produkt i bestillingen.";
  }

  if (fulfillmentType === "pickup") {
    if (!pickupTime) {
      errors.pickupTime = "Afhentningstidspunkt er påkrævet.";
    } else if (!timeRegex.test(pickupTime)) {
      errors.pickupTime =
        "Ugyldigt format. Brug fx: 14, 14.00, 14-16.";
    }
  }

  if (fulfillmentType === "delivery") {
    if (!address) {
      errors.address = "Adresse er påkrævet.";
    }
    if (!zip) {
      errors.zip = "Postnr er påkrævet.";
    }
    if (!deliveryTime) {
      errors.deliveryTime = "Leveringstidspunkt er påkrævet.";
    } else if (!timeRegex.test(deliveryTime)) {
      errors.deliveryTime =
        "Ugyldigt format. Brug fx: 14, 14.00, 14-16.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Der er fejl i formularen. Ret venligst de markerede felter.",
      errors,
      paidChecked: paid,
    };
  }

  const totalPrice = orderItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const agreedPrice = agreedPriceRaw ? Number(agreedPriceRaw) : null;

  const dbResult = await createOrderWithItems({
    orderDate,
    customerName,
    phone,
    orderedBy,
    paid,
    agreedPrice,
    totalPrice,
    fulfillmentType,
    pickupTime,
    address,
    zip,
    deliveryTime,
    orderNote,
    orderItems,
  });

  if (!dbResult.success) {
    return {
      success: false,
      message:
        dbResult.message || "Der skete en fejl ved gemning af bestillingen.",
      errors: {},
      paidChecked: paid,
    };
  }

  revalidatePath("/orders");
  redirect("/orders?created=true");
}
