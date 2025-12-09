import { supabase } from "@/lib/supabaseClient";
import fs from "fs";
import path from "path";

function isTestMode() {
  return process.env.TEST_ENV === "true";
}

/* ---------------- MOCK FIL STYRING ---------------- */

function getMockPath() {
  return path.join(
    process.cwd(),
    isTestMode() ? "mock.customizations.test.json" : "customizations.mock.json"
  );
}

function readMock() {
  const file = fs.readFileSync(getMockPath(), "utf8");
  return JSON.parse(file);
}

function writeMock(data) {
  fs.writeFileSync(getMockPath(), JSON.stringify(data, null, 2), "utf8");
}

/* -----------------------------------------------------
   HENT TYPER + OPTIONS (uden "andet se note")
------------------------------------------------------ */

export async function getCustomizationTypesWithOptions() {
  if (isTestMode()) {
    const mock = readMock();

    return mock.types.map((t) => ({
      ...t,
      options: t.options.filter(
        (o) => o.name.toLowerCase() !== "andet, se note"
      ),
    }));
  }

  const { data, error } = await supabase
    .from("customization_types")
    .select(`
      id,
      name,
      customization_options ( id, name )
    `)
    .order("name", { ascending: true });

  if (error) {
    console.error("Fejl ved hentning af customization types:", error);
    return [];
  }

  return data.map((t) => ({
    id: t.id,
    name: t.name,
    options: (t.customization_options || []).filter(
      (opt) => opt.name.toLowerCase() !== "andet, se note"
    ),
  }));
}

/* -----------------------------------------------------
   HENT PRODUKTETS VALGTE OPTIONS
------------------------------------------------------ */

export async function getProductCustomizationOptionIds(productId) {
  if (isTestMode()) {
    return readMock().productLinks[productId] || [];
  }

  const { data, error } = await supabase
    .from("product_customization_options")
    .select("option_id")
    .eq("product_id", productId);

  if (error) {
    console.error("Fejl ved hentning af produktets customization options:", error);
    return [];
  }

  return data.map((r) => r.option_id);
}

/* -----------------------------------------------------
   GEM: tilføj ALDRIG "andet" i UI,
   men TILFØJ det altid i DB hvis en type er valgt
------------------------------------------------------ */

export async function setProductCustomizations(productId, optionIds) {
  const selected = Array.from(
    new Set(optionIds.map((n) => Number(n)).filter((x) => Number.isFinite(x)))
  );

  /* ------------ MOCK MODE ------------- */
  if (isTestMode()) {
    const mock = readMock();

    const allTypes = mock.types;

    const selectedTypes = new Set();

    // Find hvilke typer der er i brug
    for (const type of allTypes) {
      for (const opt of type.options) {
        if (selected.includes(opt.id)) {
          selectedTypes.add(type.id);
        }
      }
    }

    // Tilføj always-add "andet se note"
    for (const type of allTypes) {
      if (selectedTypes.has(type.id)) {
        const noteOpt = type.options.find(
          (o) => o.name.toLowerCase() === "andet, se note"
        );
        if (noteOpt) selected.push(noteOpt.id);
      }
    }

    mock.productLinks[productId] = Array.from(new Set(selected));
    writeMock(mock);

    return { success: true, mode: "mock" };
  }

  /* ------------ REAL DATABASE ------------- */

  if (selected.length === 0) {
    await supabase
      .from("product_customization_options")
      .delete()
      .eq("product_id", productId);

    return { success: true };
  }

  // Find type_id for valgte options
  const { data: options, error: optErr } = await supabase
    .from("customization_options")
    .select("id, type_id, name")
    .in("id", selected);

  if (optErr) {
    console.error(optErr);
    return { success: false };
  }

  const typeIds = Array.from(new Set(options.map((o) => o.type_id)));

  // Find "andet se note" option for hver type
  const { data: notes } = await supabase
    .from("customization_options")
    .select("id, type_id, name")
    .in("type_id", typeIds);

  for (const row of notes) {
    if (row.name.toLowerCase() === "andet, se note") {
      selected.push(row.id);
    }
  }

  const finalIds = Array.from(new Set(selected));

  // Slet gamle links
  await supabase
    .from("product_customization_options")
    .delete()
    .eq("product_id", productId);

  // Indsæt nye
  const rows = finalIds.map((id) => ({
    product_id: productId,
    option_id: id,
  }));

  await supabase.from("product_customization_options").insert(rows);

  return { success: true, mode: "db" };
}

