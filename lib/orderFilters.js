export function getLocalTodayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * orders: array (med date_needed_raw på hver ordre)
 * params: { search, date, from, to, fulfillment, range }
 */
export function applyOrdersFilters(orders, params = {}) {
  const search = (params.search || "").toLowerCase().trim();
  const date = params.date || "";
  const from = params.from || "";
  const to = params.to || "";
  const fulfillment = params.fulfillment || "";
  const range = params.range || "";

  const today = getLocalTodayStr();
  const hasDateFilter = !!date || !!from || !!to;

  let filtered = orders;

  // Range (kun hvis man ikke har valgt dato/periode)
  if (!hasDateFilter) {
    if (range === "old") {
      filtered = filtered.filter((o) => o.date_needed_raw < today);
    } else if (range === "new") {
      filtered = filtered.filter((o) => o.date_needed_raw >= today);
    } else if (range === "all") {
      // no-op
    } else {
      // default = i dag
      filtered = filtered.filter((o) => o.date_needed_raw === today);
    }
  }

  // Search (kunde eller produkt)
  if (search) {
    filtered = filtered.filter((o) => {
      const customer = (o.customer_name || "").toLowerCase();
      const matchesCustomer = customer.includes(search);

      const matchesProduct = Array.isArray(o.order_items)
        ? o.order_items.some((item) =>
            (item.products?.name || "").toLowerCase().includes(search)
          )
        : false;

      return matchesCustomer || matchesProduct;
    });
  }

  // Enkelt dato
  if (date) {
    filtered = filtered.filter((o) => o.date_needed_raw === date);
  }

  // Periode (from-to)
  if (!date && from && to) {
    filtered = filtered.filter(
      (o) => o.date_needed_raw >= from && o.date_needed_raw <= to
    );
  }

  // fulfillment
  if (fulfillment === "delivery") {
    filtered = filtered.filter((o) => o.delivery_type === "delivery");
  } else if (fulfillment === "pickup") {
    filtered = filtered.filter((o) => o.delivery_type === "pickup");
  }

  // sort old desc (som din client gør)
  if (!hasDateFilter && range === "old") {
    filtered = [...filtered].sort((a, b) =>
      b.date_needed_raw.localeCompare(a.date_needed_raw)
    );
  }

  return filtered;
}
