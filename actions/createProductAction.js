"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createProductInDb } from "@/lib/products";
import { isValidProductCategory } from "@/lib/productCategories";
import fs from "fs";
import path from "path";

export async function createProductAction(formData) {
  const name = formData.get("name");
  const price = parseFloat(formData.get("price"));
  let ingredients = formData.get("ingredients");
  if (!ingredients || ingredients.trim() === "") {
    ingredients = "Udfyldes senere...";
  }
  const category = formData.get("category");

  if (!isValidProductCategory(category)) {
    return { success: false, error: "INVALID_CATEGORY" };
  }

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

  // ---------- IMAGE HANDLING ----------
  let imagePath = "/assets/defaultBillede.jpg";
  const image = formData.get("image");

  if (image && image.size > 0) {
    const safeName = image.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${safeName}`;
    const outputPath = path.join(process.cwd(), "public", "assets", uniqueName);

    const bytes = await image.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(bytes));

    imagePath = `/assets/${uniqueName}`;
  }

  // ---------- USE LIB FUNCTION ----------
  await createProductInDb({
    name,
    price,
    ingredients,
    category,
    nutrition,
    image: imagePath,
  });

  revalidatePath("/products");
  redirect("/products?created=true");
}

