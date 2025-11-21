"use server";

import { updateProductActiveBool } from "@/lib/products";
import { revalidatePath } from "next/cache";

export async function toggleProductActive(id, currentActive) {
  const newActive = !currentActive;

  await updateProductActiveBool(id, newActive);
  revalidatePath("/products");
}
