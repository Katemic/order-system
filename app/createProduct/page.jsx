"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction } from "@/actions/createProductAction";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";
import Image from "next/image";

export default function CreateProductPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);

  const [state, formAction, isPending] = useActionState(createProductAction, {
    fieldErrors: {},
    values: {},
  });

  const errors = state.fieldErrors || {};
  const values = state.values || {};

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 pt-20">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Opret produkt</h1>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Tilbage til produkter
          </button>
        </div>

        <form className="space-y-6" action={formAction}>

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
                defaultValue={values.name}
                className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.name ? "border-red-500" : "border-gray-300"
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
                  defaultValue={values.price}
                  className={`w-full rounded-lg border px-3 py-2 text-sm pr-10 ${errors.price ? "border-red-500" : "border-gray-300"
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
              defaultValue={values.category || ""}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.category ? "border-red-500" : "border-gray-300"
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
              defaultValue={values.ingredients}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Hvedemel, vand, surdej (hvede), salt..."
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
                    defaultValue={values[key]}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5"
                  />
                </div>
              ))}
            </div>
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

              {(imagePreview || values.imagePreview) && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Forhåndsvisning:</p>
                  <Image
                    src={imagePreview || values.imagePreview}
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

            {/* GLOBAL FEJL */}
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
              {isPending ? "Opretter..." : "Opret"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

