"use server";

import { deleteProductInDb } from "@/lib/products";

export async function deleteProductAction(id) {
  const result = await deleteProductInDb(id);
  return result;
}
