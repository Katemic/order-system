"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createProduct } from "@/lib/products";
import { isValidProductCategory } from "@/lib/productCategories";
import fs from "fs";
import path from "path";

export async function createProductAction(prevState, formData) {
  const values = Object.fromEntries(formData);

  const fieldErrors = {};

  // ------ SERVER VALIDERING ------
  if (!values.name) fieldErrors.name = "Skal udfyldes";
  if (!values.price) fieldErrors.price = "Skal udfyldes";
  if (!isValidProductCategory(values.category))
    fieldErrors.category = "Vælg en kategori";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
      values,
    };
  }

  // ---------- IMAGE ----------
  let imagePath = "/assets/defaultBillede.jpg";
  const image = formData.get("image");

  if (image && image.size > 0) {
    const safeName = image.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${safeName}`;
    const outputPath = path.join(process.cwd(), "public", "assets", uniqueName);
    const bytes = Buffer.from(await image.arrayBuffer());

    fs.writeFileSync(outputPath, bytes);
    imagePath = `/assets/${uniqueName}`;
  }

  // ---------- NUTRITION ----------
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

  // ---------- SAVE ----------
  await createProductInDb({
    name: values.name,
    price: parseFloat(values.price),
    ingredients: values.ingredients || "Udfyldes senere...",
    category: values.category,
    nutrition,
    image: imagePath,
  });

  revalidatePath("/products");
  redirect("/products?created=true");
}
