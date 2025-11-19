"use server";

import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateProductInDb } from "@/lib/products";

export async function updateProductAction(formData) {
  const id = Number(formData.get("id"));

  // ---------- BASIC FIELDS ----------
  const name = formData.get("name");
  const price = Number(formData.get("price"));
  let ingredients = formData.get("ingredients");
  const category = formData.get("category");

  if (!ingredients || ingredients.trim() === "") {
    ingredients = "Udfyldes senere...";
  }

  // ---------- NUTRITION ----------
  const nutrition = {
    Energy_kcal: Number(formData.get("Energy_kcal")),
    Energy_kJ: Number(formData.get("Energy_kJ")),
    Fat: Number(formData.get("Fat")),
    Saturated_fatty_acids: Number(formData.get("Saturated_fatty_acids")),
    Carbohydrates: Number(formData.get("Carbohydrates")),
    Sugars: Number(formData.get("Sugars")),
    Dietary_fiber: Number(formData.get("Dietary_fiber")),
    Protein: Number(formData.get("Protein")),
    Salt: Number(formData.get("Salt")),
    Water_content: Number(formData.get("Water_content")),
  };

  // ---------- IMAGE ----------
  let imagePath = formData.get("existingImage") ?? null;
  const image = formData.get("image");

  if (image && image.size > 0) {
    const safe = image.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const unique = `${Date.now()}-${safe}`;

    const bytes = Buffer.from(await image.arrayBuffer());
    const out = path.join(process.cwd(), "public", "assets", unique);

    fs.writeFileSync(out, bytes);
    imagePath = `/assets/${unique}`;
  }

  // ---------- DB CALL ----------
  await updateProductInDb(id, {
    name,
    price,
    ingredients,
    category,
    nutrition,
    image: imagePath,
  });

  revalidatePath("/products");
  redirect(`/products?updated=true&productId=${id}`);
}

