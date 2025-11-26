// lib/orderHelpers.js
export function parseTimeToMinutes(value) {
  if (!value) return Infinity;

  const start = value.split("-")[0].trim();

  if (start.includes(":")) {
    const [h, m] = start.split(":").map(Number);
    return h * 60 + (m || 0);
  }

  const num = Number(start);
  if (!isNaN(num)) {
    return num * 60;
  }

  return Infinity;
}

export function sortOrders(orders) {
  return orders.sort((a, b) => {
    const dateA = new Date(a.date_needed);
    const dateB = new Date(b.date_needed);
    if (dateA - dateB !== 0) return dateA - dateB;

    const timeA =
      a.delivery_type === "delivery" ? a.delivery_time : a.pickup_time;
    const timeB =
      b.delivery_type === "delivery" ? b.delivery_time : b.pickup_time;

    const minutesA = parseTimeToMinutes(timeA);
    const minutesB = parseTimeToMinutes(timeB);

    return minutesA - minutesB;
  });
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("da-DK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
