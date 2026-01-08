import { getAllOrders } from "@/lib/orders";
import { parseTimeToMinutes } from "@/lib/helpers/orderHelpers";

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

export async function getProductionList({
  date,
  from,
  to,
  productionCategory,
}) {
  const orders = await getAllOrders();

  //date filtering
  const filteredOrders = orders.filter((order) => {
    if (date) return order.date_needed === date;
    if (from && to) return order.date_needed >= from && order.date_needed <= to;
    return true;
  });

  //flatten order_items
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

  //group pr item type (name + custom + note)
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

  //join
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


//calculate earliest ready time and early production
const FINAL_EARLY_LIMIT = 9 * 60; // kl 09:00
const final = [];

//sort product names alphabetically (case-insensitive)
const sortedProductNames = Object.keys(productMap).sort((a, b) =>
  a.localeCompare(b, "da", { sensitivity: "base" })
);

for (const productName of sortedProductNames) {
  const rows = Object.values(productMap[productName]);


  const withTimes = rows.map((row) => {
    if (!row.readyTimes.length) {
      return {
        ...row,
        earliestReady: null,
        earlyProduction: null,
        orderCount: row.orderIds.size,
      };
    }

    const sortedTimes = [...row.readyTimes].sort(
      (a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b)
    );

    const countByTime = {};
    for (const t of sortedTimes) {
      countByTime[t] = (countByTime[t] || 0) + 1;
    }

    const early =
      row.orderIds.size > 1
        ? Object.entries(countByTime)
            .filter(([time]) => parseTimeToMinutes(time) < FINAL_EARLY_LIMIT)
            .sort(([a], [b]) => parseTimeToMinutes(a) - parseTimeToMinutes(b))
            .map(([time, quantity]) => ({ time, quantity }))
        : null;

    return {
      ...row,
      earliestReady: sortedTimes[0],
      earlyProduction: early && early.length ? early : null,
      orderCount: row.orderIds.size,
    };
  });

  //sort only by earliest ready time
  withTimes.sort((a, b) => {
    const aTime =
      a.earliestReady === null
        ? Number.POSITIVE_INFINITY
        : parseTimeToMinutes(a.earliestReady);

    const bTime =
      b.earliestReady === null
        ? Number.POSITIVE_INFINITY
        : parseTimeToMinutes(b.earliestReady);

    return aTime - bTime;
  });

  //keep the grouped rows together in the final list
  final.push(...withTimes);
}

return final;
} 
