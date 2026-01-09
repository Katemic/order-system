"use server";

import { deleteOrder } from "../../lib/orders";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteOrderAction(formData) {
  const id = Number(formData.get("id"));
  const currentUrl = formData.get("currentUrl");

  await deleteOrder(id);

  revalidatePath("/orders");

  const separator = currentUrl.includes("?") ? "&" : "?";
  const redirectUrl = `${currentUrl}${separator}deleted=true&id=${id}`;

  redirect(redirectUrl);
}
