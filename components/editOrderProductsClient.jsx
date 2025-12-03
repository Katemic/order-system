"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductsGrid from "./ProductsGrid";
import OrderSummary from "./OrderSummary";
import OrderProductModal from "./OrderProductModal";
import { updateOrderItemsAction } from "@/actions/updateOrderItemsAction";

export default function EditProductsClient({ orderId, initialItems, products }) {
  const router = useRouter();

  const [orderItems, setOrderItems] = useState(initialItems);
  const [editingItemState, setEditingItemState] = useState(null);

  const handleAddToOrder = ({ product, quantity, note }) => {
    setOrderItems((prev) => [
      ...prev,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        note,
      },
    ]);
  };

  const handleEditItemFromList = (index) => {
    const item = orderItems[index];
    if (!item) return;

    setEditingItemState({ index, item });
  };

  const handleSaveEditedItem = ({ quantity, note }) => {
    const { index } = editingItemState;

    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity,
        note,
      };
      return updated;
    });

    setEditingItemState(null);
  };

  const handleRemoveItemFromList = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceed = async () => {
    if (orderItems.length === 0) return;

    await updateOrderItemsAction({
      orderId,
      items: orderItems,
    });
  };

  return (
    <div className="flex flex-col gap-4">

      {/* ← Tilbage-knap */}
      <button
        type="button"
        onClick={() => router.push("/orders")}
        className="self-start px-4 py-2 rounded-lg border border-neutral-300 
                   text-sm text-neutral-700 hover:bg-neutral-100 transition"
      >
        ← Tilbage til bestillinger
      </button>

      <div className="flex gap-8 items-start">
        <div className="flex-1">
          <ProductsGrid
            products={products}
            variant="order"
            onAddToOrder={handleAddToOrder}
          />
        </div>

        <OrderSummary
          items={orderItems}
          onEditItem={handleEditItemFromList}
          onRemoveItem={handleRemoveItemFromList}
          onProceed={handleProceed}
          showReset={false}
        />

        {editingItemState && (
          <OrderProductModal
            key={editingItemState.index}
            product={{
              id: editingItemState.item.productId,
              name: editingItemState.item.name,
              price: editingItemState.item.price,
            }}
            initialQuantity={editingItemState.item.quantity}
            initialNote={editingItemState.item.note}
            mode="edit"
            onConfirm={handleSaveEditedItem}
            onClose={() => setEditingItemState(null)}
          />
        )}
      </div>
    </div>
  );
}

