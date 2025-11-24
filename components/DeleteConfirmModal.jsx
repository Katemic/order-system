"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { deleteProductAction } from "@/actions/deleteProductAction";

export default function DeleteConfirmModal({ product, onClose, onDeleteComplete }) {
  const pathname = usePathname();        // fx "/products"
  const searchParams = useSearchParams(); // fx "?category=Morgenbrød"

  const currentUrl =
    searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-3">Er du sikker?</h2>

        <p className="text-sm text-gray-600 mb-6">
          Produktet “{product.name}” vil blive permanent fjernet.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            Annuller
          </button>

          <form
            action={async (formData) => {
              await deleteProductAction(formData);

              onClose();
              if (onDeleteComplete) onDeleteComplete();
            }}
          >
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="name" value={product.name} />
            <input type="hidden" name="currentUrl" value={currentUrl} />

            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg">
              Slet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



