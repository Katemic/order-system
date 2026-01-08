import { supabase } from "@/lib/supabaseClient";
import fs from "fs";
import path from "path";

function isTestMode() {
  return process.env.TEST_ENV === "true";
}

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
    .select(
      `
      id,
      name,
      customization_options ( id, name )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("Fejl ved hentning af customization types:", error);
    return [];
  }

  return data
    .filter((t) => Number(t.id) !== 0)
    .map((t) => ({
      id: t.id,
      name: t.name,
      options: (t.customization_options || []).filter(
        (opt) =>
          opt.name.toLowerCase() !== "andet, se note" && Number(opt.id) !== 0
      ),
    }));
}

export async function getProductCustomizationOptionIds(productId) {
  if (isTestMode()) {
    return readMock().productLinks[productId] || [];
  }

  const { data, error } = await supabase
    .from("product_customization_options")
    .select("option_id")
    .eq("product_id", productId);

  if (error) {
    console.error(
      "Fejl ved hentning af produktets customization options:",
      error
    );
    return [];
  }

  return data.map((r) => r.option_id).filter((id) => Number(id) !== 0);
}

export async function setProductCustomizations(productId, optionIds) {
  const selected = Array.from(
    new Set(optionIds.map((n) => Number(n)).filter((x) => Number.isFinite(x)))
  );

  if (isTestMode()) {
    const mock = readMock();

    const allTypes = mock.types;

    const selectedTypes = new Set();

    // Find the types in use
    for (const type of allTypes) {
      for (const opt of type.options) {
        if (selected.includes(opt.id)) {
          selectedTypes.add(type.id);
        }
      }
    }

    // Always add "andet se note"
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

    return { success: true };
  }

  if (selected.length === 0) {
    await supabase
      .from("product_customization_options")
      .delete()
      .eq("product_id", productId);

    return { success: true };
  }

  // Find type_id for selected options
  const { data: options, error: optErr } = await supabase
    .from("customization_options")
    .select("id, type_id, name")
    .in("id", selected);

  if (optErr) {
    console.error(optErr);
    return { success: false };
  }

  const typeIds = Array.from(new Set(options.map((o) => o.type_id)));

  // Find "andet se note" option for each type
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

  // Delete old links
  await supabase
    .from("product_customization_options")
    .delete()
    .eq("product_id", productId);

  // Insert new
  const rows = finalIds.map((id) => ({
    product_id: productId,
    option_id: id,
  }));

  await supabase.from("product_customization_options").insert(rows);

  return { success: true };
}

export async function createCustomizationType(title, options) {
  if (isTestMode()) {
    const mock = readMock();

    const newId = mock.types.length
      ? Math.max(...mock.types.map((t) => t.id)) + 1
      : 1;

    const formattedOptions = options.map((name, i) => ({
      id: newId * 100 + (i + 1),
      name,
    }));

    mock.types.push({
      id: newId,
      name: title,
      options: [
        ...formattedOptions,
        { id: newId * 100 + 999, name: "Andet, se note" },
      ],
    });

    writeMock(mock);
    return { id: newId };
  }

  //Insert type
  const { data: typeRow, error: typeErr } = await supabase
    .from("customization_types")
    .insert({ name: title })
    .select("id")
    .single();

  if (typeErr) throw typeErr;

  const typeId = typeRow.id;

  //Insert options
  const rows = options.map((name) => ({
    name,
    type_id: typeId,
  }));

  await supabase.from("customization_options").insert(rows);

  // Insert "Andet, se note"
  await supabase.from("customization_options").insert({
    name: "Andet, se note",
    type_id: typeId,
  });

  return { id: typeId };
}

export async function deleteCustomization(id) {
  if (isTestMode()) {
    const mock = readMock();

    // Remove the type
    mock.types = mock.types.filter((t) => t.id !== Number(id));

    // Remove all links in productLinks
    for (const pId of Object.keys(mock.productLinks)) {
      mock.productLinks[pId] = mock.productLinks[pId].filter(
        (optId) =>
          !mock.types.some((t) => t.options.some((o) => o.id === optId))
      );
    }

    writeMock(mock);
    return { success: true };
  }

  await supabase.from("customization_options").delete().eq("type_id", id);
  await supabase.from("customization_types").delete().eq("id", id);

  return { success: true };
}

export async function getCustomizationById(id) {
  if (isTestMode()) {
    const mock = readMock();
    const type = mock.types.find((t) => t.id === Number(id));
    if (!type) return null;

    return {
      id: type.id,
      name: type.name,
      options: type.options.filter(
        (o) => o.name.toLowerCase() !== "andet, se note"
      ),
    };
  }

  const { data, error } = await supabase
    .from("customization_types")
    .select(
      `
      id,
      name,
      customization_options ( id, name )
    `
    )
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    id: data.id,
    name: data.name,
    options: data.customization_options.filter(
      (o) => o.name.toLowerCase() !== "andet, se note"
    ),
  };
}

export async function updateCustomization(id, title, options) {
  if (isTestMode()) {
    const mock = readMock();
    const type = mock.types.find((t) => t.id === Number(id));
    if (!type) return;

    type.name = title;

    const existing = type.options.filter(
      (o) => o.name.toLowerCase() !== "andet, se note"
    );

    const existingNames = existing.map((o) => o.name);

    const newOptions = [
      ...existing.filter((o) => options.includes(o.name)),
      ...options
        .filter((name) => !existingNames.includes(name))
        .map((name, i) => ({
          id: Date.now() + i,
          name,
        })),
    ];

    type.options = [
      ...newOptions,
      type.options.find((o) => o.name.toLowerCase() === "andet, se note"),
    ];

    writeMock(mock);
    return { success: true };
  }

  // Update title
  await supabase
    .from("customization_types")
    .update({ name: title })
    .eq("id", id);

  // Fetch existing options (excluding "Andet, se note")
  const { data: existingOptions } = await supabase
    .from("customization_options")
    .select("id, name")
    .eq("type_id", id)
    .neq("name", "Andet, se note");

  const existingNames = existingOptions.map((o) => o.name);

  const toInsert = options
    .filter((name) => !existingNames.includes(name))
    .map((name) => ({
      name,
      type_id: id,
    }));

  const toDelete = existingOptions
    .filter((o) => !options.includes(o.name))
    .map((o) => o.id);

  // Insert new
  if (toInsert.length > 0) {
    await supabase.from("customization_options").insert(toInsert);
  }

  // Delete removed
  if (toDelete.length > 0) {
    await supabase.from("customization_options").delete().in("id", toDelete);
  }

  return { success: true };
}
