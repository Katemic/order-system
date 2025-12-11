"use server";

import { deleteCustomization } from "@/lib/customizations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteCustomizationAction(formData) {
  const id = formData.get("id");
  const name = encodeURIComponent(formData.get("name"));
  const currentUrl = formData.get("currentUrl");

  await deleteCustomization(id);

  revalidatePath("/customizations");

  const separator = currentUrl.includes("?") ? "&" : "?";
  const redirectUrl = `${currentUrl}${separator}deleted=true&name=${name}`;

  redirect(redirectUrl);
}
