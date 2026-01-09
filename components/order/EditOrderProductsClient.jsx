"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductsGrid from "../shared/ProductsGrid";
import OrderSummary from "./OrderSummary";
import OrderProductModal from "./OrderProductModal";
import { updateOrderItemsAction } from "@/actions/order/updateOrderItemsAction";

export default function EditProductsClient({
  orderId,
  initialItems,
  products,
}) {
  const router = useRouter();

  const [orderItems, setOrderItems] = useState(
    initialItems.map((item) => ({
      ...item,
      customizations: item.customizations || {},
    }))
  );

  const [editingItemState, setEditingItemState] = useState(null);

  const handleAddToOrder = ({ product, quantity, note, customizations }) => {
    setOrderItems((prev) => [
      ...prev,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        note,
        customizations: customizations || {},
      },
    ]);
  };

  const handleEditItemFromList = (index) => {
    const item = orderItems[index];
    if (!item) return;

    const fullProduct =
      products.find((p) => Number(p.id) === Number(item.productId)) || null;

    setEditingItemState({
      index,
      item,
      product: fullProduct,
    });
  };

  const handleSaveEditedItem = ({ quantity, note, customizations }) => {
    const { index } = editingItemState;

    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity,
        note,
        customizations: customizations || {},
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
      <button
        type="button"
        onClick={() => router.push("/orders")}
        className="self-start px-4 py-2 rounded-lg border border-neutral-300 
                   text-sm text-neutral-700 hover:bg-neutral-100 transition"
      >
        ← Tilbage til bestillinger
      </button>

      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
        <div className="w-full min-w-0 flex-auto">
          <ProductsGrid
            products={products}
            variant="order"
            onAddToOrder={handleAddToOrder}
          />
        </div>

        <div className="w-full sm:flex-none sm:basis-[clamp(240px,24vw,360px)]">
          <OrderSummary
            items={orderItems}
            onEditItem={handleEditItemFromList}
            onRemoveItem={handleRemoveItemFromList}
            onProceed={handleProceed}
            proceedLabel="Gem ændringer"
            showReset={false}
          />
        </div>

        {editingItemState && (
          <OrderProductModal
            key={editingItemState.index}
            product={{
              id: editingItemState.item.productId,
              name: editingItemState.item.name,
              price: editingItemState.item.price,
              customizationOptions:
                editingItemState.product?.customizationOptions || {},
            }}
            initialQuantity={editingItemState.item.quantity}
            initialNote={editingItemState.item.note}
            initialCustomizations={editingItemState.item.customizations || {}}
            mode="edit"
            onConfirm={handleSaveEditedItem}
            onClose={() => setEditingItemState(null)}
          />
        )}
      </div>
    </div>
  );
}
