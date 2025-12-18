import { supabase } from "@/lib/supabaseClient";
import fs from "fs";
import path from "path";

function isTestMode() {
  return process.env.TEST_ENV === "true";
}

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

export async function deleteOrder(id) {
 if (isTestMode()) {
    const data = readOrdersMock();

    const filtered = data.filter((p) => p.id !== id);

    writeOrdersMock(filtered);

    return { success: true };
  }

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return { success: false };
  }

  return { success: true };
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
        products (*),
        order_item_customizations (
          option_id,
          customization_options (
            id,
            name,
            customization_types (
              name
            )
          )
        )
      )
    `)
    .order("date_needed", { ascending: true });

  if (error) throw error;

  const mapped = (data || []).map((order) => ({
    ...order,
    order_items: (order.order_items || []).map((item) => {
      const rawCustoms = item.order_item_customizations || [];
      const customizations = {};

      rawCustoms.forEach((row) => {
        const opt = row.customization_options;
        if (!opt) return;

        const typeName = opt.customization_types?.name ?? "Tilpasning";

        if (!customizations[typeName]) {
          customizations[typeName] = [];
        }

        if (!customizations[typeName].some((o) => o.id === opt.id)) {
          customizations[typeName].push({
            id: opt.id,
            name: opt.name,
          });
        }
      });

      const { order_item_customizations: _, ...rest } = item;

      return {
        ...rest,
        customizations,
      };
    }),
  }));

  return mapped;
}

export async function getOrderById(id) {
  if (isTestMode()) {
    const orders = readOrdersMock();
    const order = orders.find((o) => o.id === id);
    return order || null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        products (
          id,
          name,
          price
        ),
        order_item_customizations (
          option_id,
          customization_options (
            id,
            name,
            customization_types (
              name
            )
          )
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Fejl ved getOrderById:", error);
    return null;
  }

  const mapped = {
    ...data,
    order_items: (data.order_items || []).map((item) => {
      const rawCustoms = item.order_item_customizations || [];
      const customizations = {};

      rawCustoms.forEach((row) => {
        const opt = row.customization_options;
        if (!opt) return;

        const typeName = opt.customization_types?.name ?? "Tilpasning";

        if (!customizations[typeName]) {
          customizations[typeName] = [];
        }

        if (!customizations[typeName].some((o) => o.id === opt.id)) {
          customizations[typeName].push({
            id: opt.id,
            name: opt.name,
          });
        }
      });

      const { order_item_customizations: _, ...rest } = item;

      return {
        ...rest,
        customizations,
      };
    }),
  };

  return mapped;
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
      customizations: item.customizations || {},
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

  const { data: insertedItems, error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsPayload)
    .select();

  if (itemsError) {
    console.error("Fejl ved oprettelse af order_items:", itemsError);
    await supabase.from("orders").delete().eq("id", order.id);

    return {
      success: false,
      message:
        "Bestillingen blev oprettet, men der skete en fejl ved tilføjelse af produkterne.",
    };
  }

  const customizationsPayload = [];

  orderItems.forEach((item, index) => {
    const row = insertedItems[index];
    if (!row) return;

    const groups = item.customizations || {};

    Object.values(groups).forEach((options) => {
      if (!Array.isArray(options)) return;

      options.forEach((opt) => {
        if (!opt || typeof opt.id === "undefined") return;

        customizationsPayload.push({
          order_item_id: row.id,
          option_id: opt.id,
        });
      });
    });
  });

  if (customizationsPayload.length > 0) {
    const { error: customError } = await supabase
      .from("order_item_customizations")
      .insert(customizationsPayload);

    if (customError) {
      console.error(
        "Fejl ved oprettelse af order_item_customizations:",
        customError
      );
      return {
        success: false,
        message:
          "Bestillingen blev delvist oprettet, men der skete en fejl ved gemning af tilpasninger.",
      };
    }
  }

  return { success: true, orderId: order.id, mode: "db" };
}


export async function UpdateOrderCustomerInfo({
  id,
  orderDate,
  customerName,
  phone,
  orderedBy,
  paid,
  agreedPrice,
  fulfillmentType,
  pickupTime,
  address,
  zip,
  deliveryTime,
  orderNote,
}) {

  if (isTestMode()) {
    const orders = readOrdersMock();
    const index = orders.findIndex((o) => o.id === Number(id));

    if (index === -1) {
      return {
        success: false,
        message: "Ordre ikke fundet i mockdata.",
      };
    }

    orders[index] = {
      ...orders[index],
      customer_name: customerName,
      customer_phone: phone || null,
      date_needed: orderDate,
      taken_by: orderedBy,
      paid,
      agreed_price: agreedPrice,
      delivery_type: fulfillmentType,
      pickup_time: fulfillmentType === "pickup" ? pickupTime : null,
      delivery_time: fulfillmentType === "delivery" ? deliveryTime : null,
      delivery_address: fulfillmentType === "delivery" ? address : null,
      delivery_zip: fulfillmentType === "delivery" ? zip : null,
      note: orderNote || null,
    };

    writeOrdersMock(orders);

    return { success: true };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      customer_name: customerName,
      customer_phone: phone || null,
      date_needed: orderDate,
      taken_by: orderedBy,
      paid,
      agreed_price: agreedPrice,
      delivery_type: fulfillmentType,
      pickup_time: fulfillmentType === "pickup" ? pickupTime : null,
      delivery_time: fulfillmentType === "delivery" ? deliveryTime : null,
      delivery_address: fulfillmentType === "delivery" ? address : null,
      delivery_zip: fulfillmentType === "delivery" ? zip : null,
      note: orderNote || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Fejl ved opdatering:", error);
    return {
      success: false,
      message: "Der skete en fejl ved opdatering af bestillingen.",
    };
  }

  return { success: true };
}


export async function updateOrderItems({ orderId, items }) {
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  if (isTestMode()) {
    const orders = readOrdersMock();
    const index = orders.findIndex((o) => o.id === Number(orderId));

    if (index === -1) {
      return {
        success: false,
        message: "Ordre ikke fundet i mockdata.",
      };
    }

    // Find exsisting max item-id, so we can make new unique id's
    const allExistingItems = orders.flatMap((o) => o.order_items || []);
    const currentMaxItemId =
      allExistingItems.length > 0
        ? Math.max(...allExistingItems.map((i) => Number(i.id)))
        : 0;

    const newOrderItems = items.map((item, i) => ({
      id: currentMaxItemId + i + 1,
      order_id: orders[index].id,
      product_id: item.productId,
      quantity: item.quantity,
      item_note: item.note || "",
      products: {
        id: item.productId,
        name: item.name,
        price: item.price,
      },
      customizations: item.customizations || {},
    }));

    orders[index] = {
      ...orders[index],
      total_price: totalPrice,
      order_items: newOrderItems,
    };

    writeOrdersMock(orders);

    return { success: true };
  }

  const { data: existingItems, error: existingError } = await supabase
    .from("order_items")
    .select("id")
    .eq("order_id", orderId);

  if (existingError) {
    console.error("Fejl ved hentning af eksisterende order_items:", existingError);
    return {
      success: false,
      message: "Kunne ikke opdatere bestilling (hent order_items).",
    };
  }

  const existingIds = (existingItems || []).map((row) => row.id);

  if (existingIds.length > 0) {
    const { error: delCustomError } = await supabase
      .from("order_item_customizations")
      .delete()
      .in("order_item_id", existingIds);

    if (delCustomError) {
      console.error(
        "Fejl ved sletning af gamle order_item_customizations:",
        delCustomError
      );
      return {
        success: false,
        message: "Kunne ikke opdatere bestilling (slet tilpasninger).",
      };
    }
  }

  // 1) Delete existing order_items
  const { error: deleteError } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", orderId);

  if (deleteError) {
    console.error("Fejl ved sletning af order_items:", deleteError);
    return {
      success: false,
      message: "Kunne ikke opdatere bestilling (slet order_items).",
    };
  }

  // 2) Insert new order_items and get them back with ids
  const rows = items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    quantity: item.quantity,
    item_note: item.note || null,
  }));

  const { data: insertedItems, error: insertError } = await supabase
    .from("order_items")
    .insert(rows)
    .select();

  if (insertError) {
    console.error("Fejl ved indsættelse af order_items:", insertError);
    return {
      success: false,
      message: "Kunne ikke opdatere bestilling (indsæt order_items).",
    };
  }

  // 3) Insert new order_item_customizations
  const customizationsPayload = [];

  items.forEach((item, index) => {
    const row = insertedItems[index];
    if (!row) return;

    const groups = item.customizations || {};

    Object.values(groups).forEach((options) => {
      if (!Array.isArray(options)) return;

      options.forEach((opt) => {
        if (!opt || typeof opt.id === "undefined") return;

        customizationsPayload.push({
          order_item_id: row.id,
          option_id: opt.id,
        });
      });
    });
  });

  if (customizationsPayload.length > 0) {
    const { error: customError } = await supabase
      .from("order_item_customizations")
      .insert(customizationsPayload);

    if (customError) {
      console.error(
        "Fejl ved oprettelse af order_item_customizations:",
        customError
      );
      return {
        success: false,
        message:
          "Bestillingens produkter blev opdateret, men der skete en fejl ved gemning af tilpasninger.",
      };
    }
  }

  // 4) Update orders.total_price
  const { error: updateError } = await supabase
    .from("orders")
    .update({ total_price: totalPrice })
    .eq("id", orderId);

  if (updateError) {
    console.error("Fejl ved opdatering af orders.total_price:", updateError);
    return {
      success: false,
      message: "Kunne ikke opdatere total_price på bestillingen.",
    };
  }

  return { success: true };
}
