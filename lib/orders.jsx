import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabaseClient";

export async function getAllOrders() {


    //need to set up mock data for orders later

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .order("date_needed", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}