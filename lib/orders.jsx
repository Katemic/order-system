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