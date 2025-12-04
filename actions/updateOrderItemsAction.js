"use server";

import { updateOrderItems } from "@/lib/orders";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateOrderItemsAction({ orderId, items }) {
  const result = await updateOrderItems({ orderId, items });

  if (!result.success) {
    throw new Error(result.message || "Fejl ved opdatering af bestilling");
  }

  revalidatePath("/orders");
  redirect(`/orders?updated=true&id=${orderId}`);
}


