import { getAllOrders } from "@/lib/orders";
import { parseTimeToMinutes } from "@/lib/orderHelpers";

//helpers

const ALLOWED_PRODUCTION_CATEGORIES = ["Bager", "Konditor"];

function getReadyTime(order) {
  return order.delivery_type === "delivery"
    ? order.delivery_time
    : order.pickup_time;
}

function groupingKey(customizations, note) {
  const hasCustom = customizations && Object.keys(customizations).length > 0;

  const customPart = hasCustom
    ? Object.entries(customizations)
        .map(
          ([type, opts]) =>
            `${type}:${opts
              .map((o) => o.name)
              .sort()
              .join(",")}`
        )
        .sort()
        .join("|")
    : "__NO_CUSTOM__";

  const notePart = note ? `NOTE:${note}` : "__NO_NOTE__";

  return `${customPart}||${notePart}`;
}

//hovedfunktion

export async function getProductionList({
  date,
  from,
  to,
  productionCategory,
}) {
  const orders = await getAllOrders();

  /* ─── Dato-filter ─── */
  const filteredOrders = orders.filter((order) => {
    if (date) return order.date_needed === date;
    if (from && to) return order.date_needed >= from && order.date_needed <= to;
    return true;
  });

  /* ─── Flad order_items ─── */
  const items = [];

  for (const order of filteredOrders) {
    for (const item of order.order_items) {
    const productionCat = item.products.production_category;

    if (!ALLOWED_PRODUCTION_CATEGORIES.includes(productionCat)) {
      continue;
    }

    if (productionCategory && productionCat !== productionCategory) {
      continue;
    }
    
      items.push({
        orderId: order.id,
        productName: item.products.name,
        productCategory: item.products.category,
        productionCategory: item.products.production_category,
        quantity: item.quantity,
        readyTime: getReadyTime(order),
        customizations: item.customizations || {},
        note: item.item_note || null,
      });
    }
  }

  /* ─── Gruppér pr. produkt + customization + note ─── */
  const productMap = {};

  for (const item of items) {
    const name = item.productName;
    const key = groupingKey(item.customizations, item.note);

    productMap[name] ??= {};
    productMap[name][key] ??= {
      productName: name,
      productCategory: item.productCategory,
      productionCategory: item.productionCategory,
      quantity: 0,
      customizations:
        item.customizations && Object.keys(item.customizations).length > 0
          ? item.customizations
          : null,
      note: item.note || null,
      readyTimes: [],
      orderIds: new Set(),
    };

    const row = productMap[name][key];

    row.quantity += item.quantity;
    row.orderIds.add(item.orderId);

    if (item.readyTime) {
      for (let i = 0; i < item.quantity; i++) {
        row.readyTimes.push(item.readyTime);
      }
    }
  }

  /* ─── Saml ─── */
  const result = [];

  for (const productName of Object.keys(productMap).sort()) {
    const groups = Object.values(productMap[productName]);

    const withoutCustom = groups.filter(
      (g) => g.customizations === null && g.note === null
    );

    const withCustomOrNote = groups.filter(
      (g) => g.customizations !== null || g.note !== null
    );

    result.push(...withoutCustom, ...withCustomOrNote);
  }

  /* ─── Beregn tider og tidlig produktion ─── */
  const FINAL_EARLY_LIMIT = 9 * 60; // kl 09:00

  const withTimes = result.map((row) => {
    if (!row.readyTimes.length) {
      return {
        ...row,
        earliestReady: null,
        earlyProduction: null,
        orderCount: row.orderIds.size,
      };
    }

    const sorted = [...row.readyTimes].sort(
      (a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b)
    );

    const countByTime = {};
    for (const t of sorted) {
      countByTime[t] = (countByTime[t] || 0) + 1;
    }

    const early =
      row.orderIds.size > 1
        ? Object.entries(countByTime)
            .filter(([time]) => parseTimeToMinutes(time) < FINAL_EARLY_LIMIT)
            .sort(([a], [b]) => parseTimeToMinutes(a) - parseTimeToMinutes(b))
            .map(([time, qty]) => ({
              time,
              quantity: qty,
            }))
        : null;

    return {
      ...row,
      earliestReady: sorted[0],
      earlyProduction: early && early.length > 0 ? early : null,
      orderCount: row.orderIds.size,
    };
  });

  /* ─── Sortér efter tid ─── */
  withTimes.sort(
    (a, b) =>
      parseTimeToMinutes(a.earliestReady) - parseTimeToMinutes(b.earliestReady)
  );

  return withTimes;
}
