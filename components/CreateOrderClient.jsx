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

  const handleAddToOrder = ({ product, quantity, note }) => {
    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      note,
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

  // Fjern produkt
  const handleRemoveItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Edit item (fra liste)
  const [editingItemState, setEditingItemState] = useState(null);

  const handleEditItem = (index) => {
    const item = orderItems[index];
    setEditingItemState({ index, item });
  };

  const handleSaveEditedItem = ({ quantity, note }) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[editingItemState.index] = {
        ...updated[editingItemState.index],
        quantity,
        note,
      };
      return updated;
    });
    setEditingItemState(null);
  };



  return (
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
        onReset={handleReset}
        onEditItem={handleEditItem}
        onRemoveItem={handleRemoveItem}
      />

      {editingItemState && (
        <OrderProductModal
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
  );
}

