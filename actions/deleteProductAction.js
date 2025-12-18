"use server";

import { deleteProduct } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProductAction(formData) {
  const id = formData.get("id");
  const currentUrl = formData.get("currentUrl");

  await deleteProduct(id);

  revalidatePath("/products");

  const separator = currentUrl.includes("?") ? "&" : "?";
  const redirectUrl = `${currentUrl}${separator}deleted=true&name=${name}`;

  redirect(redirectUrl);
}



