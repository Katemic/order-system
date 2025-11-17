"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function CreatedModal() {
  const router = useRouter();
  const params = useSearchParams();
  const created = params.get("created");

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (created === "true") setShowModal(true);
  }, [created]);

  function closeModal() {
    setShowModal(false);
    router.push("/products", { scroll: false });
  }

  return (
    <div className="space-y-6">

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl">
                ✓
              </div>

              <h2 className="text-xl font-semibold mt-4">
                Produkt oprettet
              </h2>

              <p className="text-gray-600 text-sm mt-1">
                Produktet blev oprettet korrekt.
              </p>

              <div className="mt-6 space-y-2">

                <button
                  onClick={closeModal}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Luk
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
