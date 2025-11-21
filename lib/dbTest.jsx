import { supabase } from "@/lib/supabaseClient";

export async function getOrders() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) throw error;

  console.log("Orders data:", data.length);
  return data;
}