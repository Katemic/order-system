import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabaseClient";

// ------------------ //
// INTERNAL UTILITIES //
// ------------------ //
export function getMockFilePath() {
  const isTest = process.env.TEST_ENV === "true";

  return path.join(
    process.cwd(),
    isTest ? "mockdata.test.json" : "mockdata.json"
  );
}

function readMockData() {
  const filePath = getMockFilePath();
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content);
}

function writeMockData(updatedData) {
  const filePath = getMockFilePath();
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf8");
}

function isTestMode() {
  return process.env.TEST_ENV === "true";
}

// ---------------- //
// PUBLIC FUNCTIONS //
// ---------------- //

/**
 * Get all products
 * - In production → Postgres via Supabase
 * - In test mode → JSON mock file
 */
export async function getAllProducts() {
  if (isTestMode()) {
    return readMockData();
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;

    return data.map(p => ({
    ...p,
    nutrition: {
      Energy_kcal: p.energy_kcal,
      Energy_kJ: p.energy_kj,
      Fat: p.fat,
      Saturated_fatty_acids: p.saturated_fatty_acids,
      Carbohydrates: p.carbohydrates,
      Sugars: p.sugars,
      Dietary_fiber: p.dietary_fiber,
      Protein: p.protein,
      Salt: p.salt,
      Water_content: p.water_content,
    }
  }));
}

/**
 * Get 1 product by ID
 * - In test mode → search in mock JSON
 * - In production → Postgres via Supabase
 */
export async function getProductById(id) {
  if (isTestMode()) {
    const data = readMockData();
    return data.find(p => p.id === id) || null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  // TRANSFORM DB → UI FORMAT
  data.nutrition = {
    Energy_kcal: data.energy_kcal,
    Energy_kJ: data.energy_kj,
    Fat: data.fat,
    Saturated_fatty_acids: data.saturated_fatty_acids,
    Carbohydrates: data.carbohydrates,
    Sugars: data.sugars,
    Dietary_fiber: data.dietary_fiber,
    Protein: data.protein,
    Salt: data.salt,
    Water_content: data.water_content,
  };

  return data;
}


// ---------- DATABASE + MOCK CREATE PRODUCT ----------
export async function createProductInDb(product) {
  if (isTestMode()) {
    // ---------- WRITE TO MOCK JSON ----------
    const data = readMockData();

    const ids = data.map(p => p.id);
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

    const newProduct = { id: newId, ...product };
    data.push(newProduct);

    writeMockData(data);
    return newProduct;
  }

  // ---------- WRITE TO SUPABASE ----------
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      price: product.price,
      ingredients: product.ingredients,
      image: product.image,
      category: product.category,
      active: true,

      // Nutrition mapped to columns
      energy_kcal: product.nutrition.Energy_kcal,
      energy_kj: product.nutrition.Energy_kJ,
      fat: product.nutrition.Fat,
      saturated_fatty_acids: product.nutrition.Saturated_fatty_acids,
      carbohydrates: product.nutrition.Carbohydrates,
      sugars: product.nutrition.Sugars,
      dietary_fiber: product.nutrition.Dietary_fiber,
      protein: product.nutrition.Protein,
      salt: product.nutrition.Salt,
      water_content: product.nutrition.Water_content
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}


export async function updateProductInDb(id, updates) {
  if (isTestMode()) {
    // ---------- MOCK MODE ----------
    const data = readMockData();
    const index = data.findIndex(p => p.id === id);
    if (index === -1) return null;

    // Merge mock nutrition object
    data[index] = {
      ...data[index],
      ...updates,
      nutrition: {
        ...data[index].nutrition,
        ...updates.nutrition
      }
    };

    writeMockData(data);
    return data[index];
  }

  // ---------- DATABASE MODE ----------
  const payload = {
    name: updates.name,
    price: updates.price,
    ingredients: updates.ingredients,
    category: updates.category,
    image: updates.image,

    // nutrition → kolonner
    energy_kcal: updates.nutrition.Energy_kcal,
    energy_kj: updates.nutrition.Energy_kJ,
    fat: updates.nutrition.Fat,
    saturated_fatty_acids: updates.nutrition.Saturated_fatty_acids,
    carbohydrates: updates.nutrition.Carbohydrates,
    sugars: updates.nutrition.Sugars,
    dietary_fiber: updates.nutrition.Dietary_fiber,
    protein: updates.nutrition.Protein,
    salt: updates.nutrition.Salt,
    water_content: updates.nutrition.Water_content,
  };

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProductInDb(id) {
  id = Number(id);

  const isTest = process.env.TEST_ENV === "true";

  if (isTest) {
    const filePath = getMockFilePath();
    const data = readMockData();

    const filtered = data.filter((p) => p.id !== id);

    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
    return { success: true };
  }

  // ---------- REAL DATABASE ----------
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return { success: false };
  }

  return { success: true };
}
export async function updateProductActiveBool(id, active) {
  if (isTestMode()) {
    // ---------- MOCK MODE ----------
    const data = readMockData();
    const index = data.findIndex((p) => p.id === id);
    if (index === -1) return null;

    data[index] = {
      ...data[index],
      active,
    };

    writeMockData(data); // du bruger den allerede i create/update
    return data[index];
  }

  // ---------- DATABASE MODE ----------
  const { data, error } = await supabase
    .from("products")
    .update({ active })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

