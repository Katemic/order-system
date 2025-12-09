"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";

export default function ProductForm({
  mode,
  product = null,
  action,
  customizationData = [],
  selectedCustomizationOptionIds = [],
}) {
  const router = useRouter();

  const initialImage = product?.image ?? null;
  const [imagePreview, setImagePreview] = useState(initialImage);

  // Server action state
  const [state, formAction, isPending] = useActionState(action, {
    fieldErrors: {},
    values: {},
  });

  const errors = state.fieldErrors || {};
  const values = state.values || {};

  function getValue(field, fallback = "") {
    return values[field] !== undefined ? values[field] : fallback;
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  }

  // ---------- INITIAL TYPE & OPTION STATE ----------
  const initiallySelectedTypes = customizationData
    .filter((type) =>
      type.options.some((opt) =>
        selectedCustomizationOptionIds.includes(opt.id)
      )
    )
    .map((t) => t.id);

  const [selectedTypes, setSelectedTypes] = useState(initiallySelectedTypes);
  const [selectedOptions, setSelectedOptions] = useState(
    selectedCustomizationOptionIds
  );

  const [customizationsOpen, setCustomizationsOpen] = useState(false);

  // ---------- HYDRATE AFTER VALIDATION ERROR ----------
  useEffect(() => {
    if (values.customizationTypeIds) {
      setSelectedTypes(values.customizationTypeIds.map(Number));
    }
    if (values.customizationOptionIds) {
      setSelectedOptions(values.customizationOptionIds.map(Number));
    }
  }, [values]);

  // ---------- SELECT / DESELECT TYPE ----------
function toggleType(typeId) {
  setSelectedTypes((prev) => {
    const isSelected = prev.includes(typeId);
    const newSelectedTypes = isSelected
      ? prev.filter((id) => id !== typeId)
      : [...prev, typeId];

    // Fjern alle options under typen der blev un-checket
    if (isSelected) {
      const type = customizationData.find((t) => t.id === typeId);
      if (type) {
        setSelectedOptions((prevOptions) =>
          prevOptions.filter(
            (optId) => !type.options.some((o) => o.id === optId)
          )
        );
      }
    }

    // Hvis ingen typer er valgt → fjern ALLE valgte options
    if (newSelectedTypes.length === 0) {
      setSelectedOptions([]);
    }

    return newSelectedTypes;
  });
}


  // ---------- SELECT / DESELECT OPTION ----------
  function toggleOption(optionId) {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  }

  // Sets for easier checks
  const openTypes = new Set(selectedTypes);
  const selectedSet = new Set(selectedOptions);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 pt-20">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {mode === "create" ? "Opret produkt" : "Rediger produkt"}
          </h1>

          <button
            type="button"
            onClick={() => router.push("/products")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Tilbage til produkter
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-6" action={formAction}>

          {/* Hidden fields only for edit */}
          {mode === "edit" && (
            <>
              <input type="hidden" name="id" value={product.id} />
              <input type="hidden" name="existingImage" value={product.image} />
            </>
          )}

          {/* Hidden synced TYPE + OPTION values */}
          {selectedTypes.map((id) => (
            <input
              key={"t" + id}
              type="hidden"
              name="customizationTypeIds"
              value={id}
            />
          ))}

          {selectedOptions.map((id) => (
            <input
              key={"o" + id}
              type="hidden"
              name="customizationOptionIds"
              value={id}
            />
          ))}

          {/* NAVN + PRIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NAVN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produktnavn <span className="text-red-500">*</span>
              </label>

              <input
                name="name"
                type="text"
                defaultValue={getValue("name", product?.name)}
                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* PRIS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pris <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  name="price"
                  type="number"
                  step="any"
                  defaultValue={getValue("price", product?.price)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm pr-10 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />

                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm">
                  kr
                </span>
              </div>

              {errors.price && (
                <p className="mt-1 text-xs text-red-500">{errors.price}</p>
              )}
            </div>
          </div>

          {/* KATEGORI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>

            <select
              name="category"
              defaultValue={getValue("category", product?.category ?? "")}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled>
                Vælg kategori
              </option>

              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          {/* INGREDIENSER */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredienser
            </label>

            <textarea
              name="ingredients"
              rows={3}
              defaultValue={getValue("ingredients", product?.ingredients)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* NÆRINGSINDHOLD */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Næringsindhold pr. 100 g
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ["Energy_kcal", "Energi (kcal)"],
                ["Energy_kJ", "Energi (kJ)"],
                ["Fat", "Fedt (g)"],
                ["Saturated_fatty_acids", "Heraf mættede fedtsyrer (g)"],
                ["Carbohydrates", "Kulhydrat (g)"],
                ["Sugars", "Heraf sukkerarter (g)"],
                ["Dietary_fiber", "Kostfibre (g)"],
                ["Protein", "Protein (g)"],
                ["Salt", "Salt (g)"],
                ["Water_content", "Vandindhold (g)"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {label}
                  </label>

                  <input
                    name={key}
                    type="number"
                    step="0.1"
                    defaultValue={getValue(key, product?.nutrition?.[key])}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* TILPASNINGER */}
          <div className="border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => setCustomizationsOpen((v) => !v)}
              className="w-full flex items-center justify-between text-left"
            >
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Tilpasninger
                </h2>
                <p className="text-xs text-gray-500">
                  Vælg hvilke tilpasningsmuligheder dette produkt skal have.
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {customizationsOpen ? "Skjul" : "Vis"}
              </span>
            </button>

            {customizationsOpen && (
              <div className="mt-3 space-y-2">
                {customizationData.length === 0 && (
                  <p className="text-xs text-gray-500">
                    Der er endnu ikke oprettet nogen tilpasningstyper.
                  </p>
                )}

                {customizationData.map((type) => {
                  const isOpen = openTypes.has(type.id);

                  return (
                    <div
                      key={type.id}
                      className="border border-gray-200 rounded-lg"
                    >
                      {/* TYPE CHECKBOX */}
                      <label className="flex items-center justify-between px-3 py-2 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type.id)}
                            onChange={() => toggleType(type.id)}
                          />
                          <span className="text-sm font-medium text-gray-800">
                            {type.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {isOpen ? "−" : "+"}
                        </span>
                      </label>

                      {/* OPTIONS */}
                      {isOpen && (
                        <div className="border-t border-gray-200 px-3 py-2 space-y-1">
                          {type.options.map((opt) => (
                            <label
                              key={opt.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSet.has(opt.id)}
                                onChange={() => toggleOption(opt.id)}
                              />
                              <span>{opt.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BILLEDEUPLOAD */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billedeupload
            </label>

            <div className="flex flex-col md:flex-row items-start gap-4">
              <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm">
                <span>Vælg billede</span>

                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Forhåndsvisning:</p>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={128}
                    height={128}
                    unoptimized
                    className="h-32 w-32 rounded-lg object-cover border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* KNAPPER */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">

            {Object.keys(errors).length > 0 && (
              <p className="text-red-600 text-sm font-medium mr-auto">
                Udfyld venligst alle påkrævede felter.
              </p>
            )}

            <button
              type="button"
              onClick={() => router.push("/products")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
            >
              Annuller
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 text-sm text-white disabled:opacity-60"
            >
              {isPending
                ? mode === "create"
                  ? "Opretter..."
                  : "Gemmer..."
                : mode === "create"
                ? "Opret"
                : "Gem ændringer"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}





