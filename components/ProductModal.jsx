"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function ProductModal({ product, onClose }) {
  
  const [showDelete, setShowDelete] = useState(false);
  
  if (!product) return null;


  const { id, name, price, ingredients, nutrition, category, image } = product;

  const nutritionLabels = {
    Energy_kcal: "Energi (kcal)",
    Energy_kJ: "Energi (kJ)",
    Fat: "Fedt (g)",
    Saturated_fatty_acids: "Heraf mættede fedtsyrer (g)",
    Carbohydrates: "Kulhydrat (g)",
    Sugars: "Heraf sukkerarter (g)",
    Dietary_fiber: "Kostfibre (g)",
    Protein: "Protein (g)",
    Salt: "Salt (g)",
    Water_content: "Vandindhold (%)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="modal-close-button"
          aria-label="Luk"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="modal-title">{name}</h2>

              {category && (
                <p className="modal-category">{category}</p>
              )}
            </div>

            {price != null && (
              <p className="modal-price">{price} kr.</p>
            )}

            {ingredients !== null && ingredients !== undefined && (
              <div className="mb-4">
                <h3 className="modal-subtitle">Ingredienser</h3>
                <p className="modal-description">{ingredients}</p>
              </div>
            )}

            {nutrition && (
              <div className="mb-2">
                <h3 className="modal-section-title">Næringsindhold pr. 100 g</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {Object.entries(nutrition).map(([key, value]) => {
                    const label = nutritionLabels[key];
                    return (
                      <div key={key} className="flex justify-between gap-2">
                        <dt className="modal-label">{label}</dt>
                        <dd className="modal-value">{value}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            )}
          </div>

          {image && (
            <div className="modal-image-wrapper flex flex-col items-center gap-4">
              <div className="w-full aspect-square rounded-xl bg-neutral-100 overflow-hidden flex items-center justify-center">
                <Image
                  src={image}
                  alt={name}
                  width={500}
                  height={500}
                  className="object-contain w-full h-full"
                />
              </div>

              <Link
                href={`/products/${id}/edit`}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
              >
                Rediger produkt
              </Link>

              <button
                onClick={() => setShowDelete(true)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Slet produkt
              </button>

            </div>
          )}

        </div>
      </div>

    {showDelete && (
<DeleteConfirmModal
  product={product}
  onClose={() => setShowDelete(false)}
  onDeleteComplete={onClose}
/>
)}  
    </div>



  );
}
