"use server";

import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getMockFilePath } from "@/lib/products";

export async function updateProductAction(formData) {
  const id = Number(formData.get("id"));

  //const filePath = path.join(process.cwd(), "mockdata.json");
  const filePath = getMockFilePath();
  const all = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return { success: false };

  const old = all[index];

  const updated = {
    ...old,
    name: formData.get("name"),
    price: parseFloat(formData.get("price")),
    ingredients: formData.get("ingredients"),
    nutrition: { ...old.nutrition },
  };

  for (const key in updated.nutrition) {
    updated.nutrition[key] = Number(formData.get(key));
  }

  // Billedehåndtering
  const image = formData.get("image");
  if (image && image.size > 0) {
    const safe = image.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const unique = `${Date.now()}-${safe}`;

    const bytes = Buffer.from(await image.arrayBuffer());
    const out = path.join(process.cwd(), "public", "assets", unique);

    fs.writeFileSync(out, bytes);
    updated.image = `/assets/${unique}`;
  }

  all[index] = updated;
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2));

  revalidatePath("/products");
  redirect(`/products?updated=true&productId=${id}`);
}
