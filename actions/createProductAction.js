"use server";

import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData) {
  const name = formData.get("name");
  const price = parseFloat(formData.get("price"));
  const ingredients = formData.get("ingredients");

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

  // Læs mockdata
  const filePath = path.join(process.cwd(), "mockdata.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent);

  // Auto ID
  let existingIds = data
    .map((p) => p.id)
    .filter((id) => typeof id === "number" && !isNaN(id));

  const newId =
    existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

  // Billede
  let imagePath = "/assets/defaultBillede.jpg";
  const image = formData.get("image");

  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (image && image.size > 0) {
    if (!allowedTypes.includes(image.type)) {
      return { success: false, error: "INVALID_FILE_TYPE" };
    }

    if (image.size > MAX_SIZE_BYTES) {
      return { success: false, error: "IMAGE_TOO_LARGE" };
    }

    const safeName = image.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${safeName}`;

    const outputPath = path.join(
      process.cwd(),
      "public",
      "assets",
      uniqueName
    );

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(outputPath, buffer);

    imagePath = `/assets/${uniqueName}`;
  }

  // Nyt produkt
  const newProduct = {
    id: newId,
    name,
    price,
    ingredients,
    nutrition,
    image: imagePath,
    category: "Ukendt",
    active: true,
  };

  data.push(newProduct);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  //Redirect direkte fra server action
  revalidatePath("/products");
  redirect("/products?created=true");
}



