"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { deleteProductAction } from "@/actions/deleteProductAction";
import { deleteOrderAction } from "@/actions/deleteOrderAction";

const DELETE_CONFIG = {
  product: {
    title: (item) => `Produktet “${item.name}” bliver permanent slettet.`,
    deleteAction: deleteProductAction,
    name: (item) => item.name || ""
  },
  order: {
    title: (item) => `Bestilling #${item.id} bliver permanent slettet.`,
    deleteAction: deleteOrderAction,
    name: () => ""
  }
};

export default function DeleteConfirmModal({ item, type, onClose, onDeleteComplete }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { title, deleteAction, name } = DELETE_CONFIG[type];

  // Behold query params
  const currentUrl = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  async function handleDelete(formData) {
    await deleteAction(formData);
    onClose();
    onDeleteComplete?.();
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
        <h2 className="text-lg font-semibold mb-3">Er du sikker på, at du vil slette?</h2>

        <p className="text-sm text-gray-600 mb-6">{title(item)}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            Annuller
          </button>

          <form action={handleDelete}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="name" value={name(item)} />
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




