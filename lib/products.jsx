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

function mapDbRowToProduct(row) {
  if (!row) return null;

  return {
    ...row,
    nutrition: {
      Energy_kcal: row.energy_kcal,
      Energy_kJ: row.energy_kj,
      Fat: row.fat,
      Saturated_fatty_acids: row.saturated_fatty_acids,
      Carbohydrates: row.carbohydrates,
      Sugars: row.sugars,
      Dietary_fiber: row.dietary_fiber,
      Protein: row.protein,
      Salt: row.salt,
      Water_content: row.water_content,
    },
  };
}

function mapProductToDbPayload(product) {
  if (!product) return null;

  const nutrition = product.nutrition || {};

  return {
    name: product.name,
    price: product.price,
    ingredients: product.ingredients,
    image: product.image,
    category: product.category,
    active:
      typeof product.active === "boolean" ? product.active : true,

    energy_kcal: nutrition.Energy_kcal,
    energy_kj: nutrition.Energy_kJ,
    fat: nutrition.Fat,
    saturated_fatty_acids: nutrition.Saturated_fatty_acids,
    carbohydrates: nutrition.Carbohydrates,
    sugars: nutrition.Sugars,
    dietary_fiber: nutrition.Dietary_fiber,
    protein: nutrition.Protein,
    salt: nutrition.Salt,
    water_content: nutrition.Water_content,
  };
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

  return data.map(mapDbRowToProduct);
}

/**
 * Get 1 product by ID
 * - In test mode → search in mock JSON
 * - In production → Postgres via Supabase
 */
export async function getProductById(id) {
  if (isTestMode()) {
    const data = readMockData();
    return data.find((p) => p.id === id) || null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return mapDbRowToProduct(data);
}

// ---------- DATABASE + MOCK CREATE PRODUCT ----------
export async function createProduct(product) {
  if (isTestMode()) {
    // ---------- WRITE TO MOCK JSON ----------
    const data = readMockData();

    const ids = data.map((p) => p.id);
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

    const newProduct = { id: newId, ...product };
    data.push(newProduct);

    writeMockData(data);
    return newProduct;
  }

  // ---------- WRITE TO SUPABASE ----------
  const payload = {
    ...mapProductToDbPayload(product),
    active: true,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return mapDbRowToProduct(data);
}

export async function updateProduct(id, updates) {
  if (isTestMode()) {
    // ---------- MOCK MODE ----------
    const data = readMockData();
    const index = data.findIndex((p) => p.id === id);
    if (index === -1) return null;

    // Merge mock nutrition object
    data[index] = {
      ...data[index],
      ...updates,
      nutrition: {
        ...data[index].nutrition,
        ...(updates.nutrition || {}),
      },
    };

    writeMockData(data);
    return data[index];
  }

  // ---------- DATABASE MODE ----------
  const payload = mapProductToDbPayload(updates);

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return mapDbRowToProduct(data);
}

export async function deleteProduct(id) {
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

    writeMockData(data);
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
  return mapDbRowToProduct(data);
}
