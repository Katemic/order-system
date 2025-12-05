"use server";

import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isValidProductCategory } from "@/lib/productCategories";
import { updateProduct } from "@/lib/products";

export async function updateProductAction(prevState, formData) {
  const values = Object.fromEntries(formData);

  const fieldErrors = {};

  // ----------- VALIDERING -----------
  if (!values.name) fieldErrors.name = "Skal udfyldes";
  if (!values.price) fieldErrors.price = "Skal udfyldes";
  if (!values.category || !isValidProductCategory(values.category))
    fieldErrors.category = "Vælg en kategori";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
      values, // sender alt tilbage til UI
    };
  }

  // ----------- KONVERTERING -----------
  const id = Number(values.id);
  const price = parseFloat(values.price);

  let ingredients = values.ingredients;
  if (!ingredients || ingredients.trim() === "") {
    ingredients = "Udfyldes senere...";
  }

  const nutrition = {
    Energy_kcal: Number(values.Energy_kcal),
    Energy_kJ: Number(values.Energy_kJ),
    Fat: Number(values.Fat),
    Saturated_fatty_acids: Number(values.Saturated_fatty_acids),
    Carbohydrates: Number(values.Carbohydrates),
    Sugars: Number(values.Sugars),
    Dietary_fiber: Number(values.Dietary_fiber),
    Protein: Number(values.Protein),
    Salt: Number(values.Salt),
    Water_content: Number(values.Water_content),
  };

  // ----------- IMAGE -----------
  let imagePath = values.existingImage || null;
  const image = formData.get("image");

  if (image && image.size > 0) {
    const safe = image.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const unique = `${Date.now()}-${safe}`;
    const output = path.join(process.cwd(), "public", "assets", unique);
    const bytes = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(output, bytes);
    imagePath = `/assets/${unique}`;
  }

  // ---------- DB CALL ----------
  await updateProduct(id, {
    name: values.name,
    price,
    ingredients,
    category: values.category,
    nutrition,
    image: imagePath,
  });

  revalidatePath("/products");
  redirect(`/products?updated=true`);
}

