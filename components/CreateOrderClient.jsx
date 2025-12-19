"use client";

import { useState, useEffect } from "react";
import ProductsGrid from "./ProductsGrid";
import OrderSummary from "./OrderSummary";
import OrderProductModal from "./OrderProductModal";

export default function CreateOrderClient({ products }) {
  const [orderItems, setOrderItems] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = window.localStorage.getItem("orderItems");
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Kunne ikke læse orderItems fra localStorage:", err);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("orderItems", JSON.stringify(orderItems));
    } catch (err) {
      console.error("Kunne ikke gemme orderItems i localStorage:", err);
    }
  }, [orderItems]);

  const handleAddToOrder = ({ product, quantity, note, customizations }) => {
    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      note,
      customizations: customizations || {},
    };

    setOrderItems((prev) => [...prev, item]);
  };

  const handleReset = () => {
    setOrderItems([]);
    try {
      window.localStorage.removeItem("orderItems");
    } catch (err) {
      console.error("Kunne ikke fjerne orderItems:", err);
    }
  };

  const handleRemoveItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const [editingItemState, setEditingItemState] = useState(null);

  const handleEditItem = (index) => {
    const item = orderItems[index];
    if (!item) return;
    setEditingItemState({ index, item });
  };

  const handleSaveEditedItem = ({ quantity, note, customizations }) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[editingItemState.index] = {
        ...updated[editingItemState.index],
        quantity,
        note,
        customizations: customizations || {},
      };
      return updated;
    });
    setEditingItemState(null);
  };

  const getProductForEdit = (item) => {
    const productId = item.productId;
    const fullProduct = products.find(
      (p) => String(p.id) === String(productId)
    );

    if (fullProduct) return fullProduct;

    return {
      id: productId,
      name: item.name,
      price: item.price,
      customizationOptions: {},
    };
  };

  return (
    <div className="flex items-start gap-3 sm:gap-6">
      <div className="min-w-0 flex-1">
        <ProductsGrid
          products={products}
          variant="order"
          onAddToOrder={handleAddToOrder}
        />
      </div>

      <div className="w-[190px] sm:w-[230px] md:w-[240px] lg:w-[320px] shrink-0">
        <OrderSummary
          items={orderItems}
          onReset={handleReset}
          onEditItem={handleEditItem}
          onRemoveItem={handleRemoveItem}
        />
      </div>

      {editingItemState && (
        <OrderProductModal
          product={getProductForEdit(editingItemState.item)}
          initialQuantity={editingItemState.item.quantity}
          initialNote={editingItemState.item.note}
          initialCustomizations={editingItemState.item.customizations || {}}
          mode="edit"
          onConfirm={handleSaveEditedItem}
          onClose={() => setEditingItemState(null)}
        />
      )}
    </div>
  );
}
