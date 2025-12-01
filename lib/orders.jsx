import { supabase } from "@/lib/supabaseClient";
import fs from "fs";
import path from "path";

function isTestMode() {
  return process.env.TEST_ENV === "true";
}

// PATH til mock-filer
function getOrdersMockPath() {
  return path.join(
    process.cwd(),
    isTestMode() ? "mock.orders.test.json" : "orders.mock.json"
  );
}

function readOrdersMock() {
  const file = fs.readFileSync(getOrdersMockPath(), "utf8");
  return JSON.parse(file);
}

function writeOrdersMock(data) {
  fs.writeFileSync(
    getOrdersMockPath(),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

export async function getAllOrders() {
  if (isTestMode()) {
    return readOrdersMock();
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .order("date_needed", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createOrderWithItems({
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
}) {
  const today = new Date();
  const dateCreated = today.toISOString().slice(0, 10);

  if (isTestMode()) {
    const existingOrders = readOrdersMock();

    const nextOrderId =
      existingOrders.length > 0
        ? Math.max(...existingOrders.map((o) => Number(o.id))) + 1
        : 1;

    const allExistingItems = existingOrders.flatMap(
      (o) => o.order_items || []
    );
    const currentMaxItemId =
      allExistingItems.length > 0
        ? Math.max(...allExistingItems.map((i) => Number(i.id)))
        : 0;

    const newOrderItems = orderItems.map((item, index) => ({
      id: currentMaxItemId + index + 1,
      order_id: nextOrderId,
      product_id: item.productId,
      quantity: item.quantity,
      item_note: item.note || "",
      products: {
        id: item.productId,
        name: item.name,
        price: item.price,
      },
    }));

    const newOrder = {
      id: nextOrderId,
      customer_name: customerName,
      customer_phone: phone || null,
      date_needed: orderDate,
      date_created: dateCreated,
      taken_by: orderedBy,
      paid,
      delivery_type: fulfillmentType,
      pickup_time: fulfillmentType === "pickup" ? pickupTime : null,
      delivery_time: fulfillmentType === "delivery" ? deliveryTime : null,
      delivery_address: fulfillmentType === "delivery" ? address : null,
      delivery_zip: fulfillmentType === "delivery" ? zip : null,
      note: orderNote || "",
      total_price: totalPrice,
      order_items: newOrderItems,
    };

    writeOrdersMock([...existingOrders, newOrder]);

    return { success: true, orderId: nextOrderId, mode: "mock" };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      customer_phone: phone || null,

      date_needed: orderDate,
      date_created: dateCreated,

      taken_by: orderedBy,
      paid,
      agreed_price: agreedPrice,
      total_price: totalPrice,

      delivery_type: fulfillmentType,
      pickup_time: fulfillmentType === "pickup" ? pickupTime : null,
      delivery_time: fulfillmentType === "delivery" ? deliveryTime : null,
      delivery_address: fulfillmentType === "delivery" ? address : null,
      delivery_zip: fulfillmentType === "delivery" ? zip : null,

      note: orderNote || null,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Fejl ved oprettelse af order:", orderError);
    return {
      success: false,
      message: "Der skete en fejl ved gemning af bestillingen.",
    };
  }

  const itemsPayload = orderItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    item_note: item.note || null,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsPayload);

  if (itemsError) {
    console.error("Fejl ved oprettelse af order_items:", itemsError);
    await supabase.from("orders").delete().eq("id", order.id);

    return {
      success: false,
      message:
        "Bestillingen blev oprettet, men der skete en fejl ved tilføjelse af produkterne.",
    };
  }

  return { success: true, orderId: order.id, mode: "db" };
}