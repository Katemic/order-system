"use server";

import { deleteProduct } from "@/lib/products";

export async function deleteProductAction(id) {
  const result = await deleteProduct(id);
  return result;
}
