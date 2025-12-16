"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleProductActive } from "../actions/toggleProductActiveAction";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { sortCustomizationOptions } from "@/lib/sortCustomizationOptions";

export default function ProductModal({ product, onClose }) {
  const [isPending, startTransition] = useTransition();
  const [confirmMode, setConfirmMode] = useState(null); // "archive" | "reactivate" | null
  const [showDelete, setShowDelete] = useState(false);

  if (!product) return null;

  const {
    id,
    name,
    price,
    ingredients,
    nutrition,
    category,
    image,
    active,
    production_category,
  } = product;

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
    Water_content: "Vandindhold (g)",
  };

  const handleMainActionClick = () => {
    if (active) {
      setConfirmMode("archive");
    } else {
      setConfirmMode("reactivate");
    }
  };

  const handleConfirm = () => {
    startTransition(async () => {
      await toggleProductActive(id, active);
      setConfirmMode(null);
      if (onClose) onClose();
    });
  };

  const handleCancel = () => {
    setConfirmMode(null);
  };

  const isArchiveConfirm = confirmMode === "archive";

  const confirmTitle = isArchiveConfirm
    ? "Arkiver produkt?"
    : "Genaktiver produkt?";

  const confirmDescription = isArchiveConfirm
    ? `Er du sikker på, at du vil arkivere ${name}? Produktet vil ikke længere være aktivt.`
    : `Er du sikker på, at du vil genaktivere ${name}? Produktet vil igen blive vist som aktivt.`;

  const confirmButtonText = isArchiveConfirm
    ? isPending
      ? "Arkiverer..."
      : "Arkiver"
    : isPending
    ? "Genaktiverer..."
    : "Genaktiver";

  const confirmButtonClasses = isArchiveConfirm
    ? "bg-red-600 hover:bg-red-700 text-white border-red-500"
    : "bg-green-600 hover:bg-green-700 text-white border-green-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="
    relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl 
    max-h-[90vh] overflow-y-auto     /* Mobil/tablet: modal scroller */
    md:max-h-none md:overflow-visible  /* Desktop: ingen modal-scroll */
  "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luk-knap */}
        <button
          onClick={onClose}
          className="modal-close-button absolute right-4 top-4 text-2xl"
          aria-label="Luk"
        >
          ✕
        </button>

        {/* ===== CONFIRM VIEW ===== */}
        {confirmMode !== null ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">{confirmTitle}</h2>

            <p className="text-neutral-700">{confirmDescription}</p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-800 hover:bg-neutral-100 disabled:opacity-60"
              >
                Annuller
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className={`px-4 py-2 rounded-lg font-medium border ${confirmButtonClasses} disabled:opacity-70 disabled:cursor-wait`}
              >
                {confirmButtonText}
              </button>
            </div>
          </div>
        ) : (
          /* ===== NORMAL PRODUCT VIEW ===== */
          <div className="flex flex-col md:flex-row gap-6">
            {/* VENSTRE SIDE - skærm højde nedenfor*/}
            <div className="flex-1 md:max-h-[60vh] md:overflow-y-auto pr-2">
              <div className="mb-4">
                <h2 className="modal-title text-2xl font-bold">{name}</h2>

                {category && (
                  <p className="modal-category text-neutral-500">{category}</p>
                )}
                {production_category && (
                  <span className="modal-category text-neutral-500">
                    Produktion: {production_category}
                  </span>
                )}
              </div>

              {price != null && (
                <p className="modal-price text-lg font-semibold mb-4">
                  {price} kr.
                </p>
              )}

              {ingredients && (
                <div className="mb-4">
                  <h3 className="modal-subtitle font-semibold text-lg">
                    Ingredienser
                  </h3>
                  <p className="modal-description text-neutral-700">
                    {ingredients}
                  </p>
                </div>
              )}

              {nutrition && (
                <div className="mb-2">
                  <h3 className="modal-section-title font-semibold text-lg">
                    Næringsindhold pr. 100 g
                  </h3>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                    {Object.entries(nutrition).map(([key, value]) => {
                      const label = nutritionLabels[key];
                      if (!label) return null;

                      return (
                        <div key={key} className="flex justify-between gap-2">
                          <dt className="text-neutral-600">{label}</dt>
                          <dd className="modal-value font-medium">{value}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              )}
              {product.customizationOptions &&
                Object.keys(product.customizationOptions).length > 0 && (
                  <div className="mt-6">
                    <h3 className="modal-section-title font-semibold text-lg mb-2">
                      Mulige tilpasninger
                    </h3>

                    <div className="flex flex-col gap-3">
                      {Object.entries(product.customizationOptions).map(
                        ([typeName, options]) => (
                          <details
                            key={typeName}
                            className="group border border-neutral-200 rounded-lg px-4 py-2 bg-neutral-50"
                          >
                            <summary className="cursor-pointer list-none flex justify-between items-center font-medium text-neutral-800 hover:text-neutral-900">
                              {typeName}

                              <span className="transition-transform group-open:rotate-90 text-neutral-500">
                                ▶
                              </span>
                            </summary>
                            {/* //ændre antal af kolonner her */}
                            <ul
                              className="mt-2 ml-1 text-sm text-neutral-700 
                            grid grid-cols-1 
                            md:grid-cols-2 
                            lg:grid-cols-3 
                            gap-1"
                            >
                              {sortCustomizationOptions(options).map((opt) => (
                                <li
                                  key={opt.id}
                                  className="flex items-center gap-2"
                                >
                                  • {opt.name}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* HØJRE SIDE */}
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

                <div className="w-full flex flex-col gap-2">
                  <Link
                    href={`/products/${id}/edit`}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                  >
                    Rediger produkt
                  </Link>

                  <button
                    type="button"
                    onClick={handleMainActionClick}
                    disabled={isPending}
                    className={`w-full px-4 py-2 rounded-lg border font-medium transition
                      ${
                        active
                          ? "border-red-400 text-red-600 hover:bg-red-50"
                          : "border-green-400 text-green-600 hover:bg-green-50"
                      }
                      ${isPending ? "opacity-70 cursor-wait" : ""}
                    `}
                  >
                    {isPending
                      ? "Opdaterer..."
                      : active
                      ? "Arkiver"
                      : "Genaktiver"}
                  </button>
                  <button
                    onClick={() => setShowDelete(true)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Slet produkt
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showDelete && (
        <DeleteConfirmModal
          item={product}
          type="product"
          onClose={() => setShowDelete(false)}
          onDeleteComplete={onClose}
        />
      )}
    </div>
  );
}
