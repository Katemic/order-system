"use server";

import { deleteProduct } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProductAction(formData) {
  const id = formData.get("id");
  const currentUrl = formData.get("currentUrl"); // fx "/products?category=Morgenbrød"
  const name = encodeURIComponent(formData.get("name"));

  await deleteProduct(id);

  // Revalidate produktlisten
  revalidatePath("/products");

  // Tilføj deleted=true og name=...
  const separator = currentUrl.includes("?") ? "&" : "?";
  const redirectUrl = `${currentUrl}${separator}deleted=true`;

  redirect(redirectUrl);
}



