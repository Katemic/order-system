"use client";

import { useRouter } from "next/navigation";
import { deleteProductAction } from "@/actions/deleteProductAction";

export default function DeleteConfirmModal({ product, onClose, onDeleteComplete }) {
  const router = useRouter();

  async function handleDelete() {
    await deleteProductAction(product.id);

    // 1. Luk confirm modal
    onClose();

    // 2. Luk product modal
    if (onDeleteComplete) onDeleteComplete();

    // 3. Redirect
    router.push(`/products?deleted=true&name=${encodeURIComponent(product.name)}`);
  }

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

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Slet
          </button>
        </div>
      </div>
    </div>
  );
}

