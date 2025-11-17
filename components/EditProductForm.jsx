"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProductAction } from "@/actions/updateProductAction";

export default function EditProductForm({ product }) {
  const router = useRouter();
  const [preview, setPreview] = useState(product.image);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append("id", product.id);

    // Validation
    const name = fd.get("name");
    const price = fd.get("price");

    let newErrors = {};
    if (!name) newErrors.name = "Skal udfyldes";
    if (!price) newErrors.price = "Skal udfyldes";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    const result = await updateProductAction(fd);
    setSubmitting(false);

    if (result?.success) {
      router.push(`/products?updated=true&productId=${product.id}`);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>

      {/* NAVN + PRIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Produktnavn *</label>
          <input
            name="name"
            defaultValue={product.name}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Pris *</label>
          <input
            name="price"
            type="number"
            step="0.50"
            defaultValue={product.price}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
        </div>
      </div>

      {/* INGREDIENSER */}
      <div>
        <label className="text-sm font-medium text-gray-700">Ingredienser</label>
        <textarea
          name="ingredients"
          rows="3"
          defaultValue={product.ingredients}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* NÆRINGSINDHOLD */}
      <div className="border-t pt-4">
        <h2 className="font-semibold text-gray-900 mb-3">Næringsindhold</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.nutrition).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs font-medium">{key}</label>
              <input
                name={key}
                type="number"
                step="0.1"
                defaultValue={value}
                className="w-full border rounded-lg px-3 py-1.5"
              />
            </div>
          ))}
        </div>
      </div>

      {/* BILLEDE */}
      <div className="border-t pt-4">
        <label className="text-sm font-medium text-gray-700">Billede</label>

        <div className="flex gap-4">
          <label className="cursor-pointer border border-dashed px-4 py-3 rounded-lg">
            Vælg billede
            <input type="file" name="image" className="hidden" onChange={handleImage} />
          </label>

          {preview && (
            <img src={preview} className="h-20 w-20 rounded-lg object-cover" />
          )}
        </div>
      </div>

      {/* KNAPPER */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="px-4 py-2 border rounded-lg"
        >
          Annuller
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          {submitting ? "Gemmer..." : "Gem"}
        </button>
      </div>
    </form>
  );
}
