"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProductAction } from "@/actions/updateProductAction";
import Image from "next/image";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";

export default function EditProductForm({ product }) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(product.image);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("Kun JPEG, PNG og WEBP er tilladt.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      alert(`Billedet er for stort. Max størrelse er ${MAX_SIZE_MB} MB.`);
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append("id", product.id);

    let newErrors = {};
    if (!fd.get("name")) newErrors.name = "Skal udfyldes";
    if (!fd.get("price")) newErrors.price = "Skal udfyldes";
    if (!fd.get("category")) newErrors.category = "Vælg en kategori";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    await updateProductAction(fd);
    // redirect sker i server action
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* NAVN + PRIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Produktnavn <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            defaultValue={product.name}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.name ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pris <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="price"
              type="number"
              defaultValue={product.price}
              step="any"
              className={`w-full rounded-lg border px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.price ? "border-red-500" : "border-gray-300"
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

      {/* KATEGORI – samme stil som create */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategori <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          defaultValue={product.category || ""}
          className={`w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.category ? "border-red-500" : "border-gray-300"
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
          defaultValue={product.ingredients}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* NÆRINGSINDHOLD */}
      <div className="border-t border-gray-200 pt-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Næringsindhold pr. 100 g
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {Object.entries(product.nutrition).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {key}
              </label>
              <input
                name={key}
                type="number"
                step="0.1"
                defaultValue={value}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
          <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-emerald-500 hover:text-emerald-600">
            <span>Vælg billede</span>
            <input
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>

          {imagePreview && (
            <div className="mt-2 md:mt-0">
              <p className="text-xs text-gray-500 mb-1">Forhåndsvisning:</p>
              <Image
                src={imagePreview}
                className="h-32 w-32 rounded-lg object-cover border border-gray-200"
                alt="Preview"
                width={128}
                height={128}
              />
            </div>
          )}
        </div>
      </div>

      {/* HANDLING KNAPPER */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        {Object.keys(errors).length > 0 && (
          <div className="pt-2 -mt-4 text-left">
            <p className="text-red-600 text-sm font-medium">
              Udfyld venligst alle påkrævede felter.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/products")}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuller
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {isSubmitting ? "Gemmer..." : "Gem ændringer"}
        </button>
      </div>
    </form>
  );
}
