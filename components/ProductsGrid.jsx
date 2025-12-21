"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import OrderProductModal from "./OrderProductModal";

export default function ProductsGrid({
  products,
  variant = "products",
  onAddToOrder,
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const hasProducts = products && products.length > 0;

  const handleClose = () => setSelectedProduct(null);

  return (
    <>
      <section
        className="
    grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    gap-4 sm:gap-5 lg:gap-6
    justify-items-center
    [@media_(min-width:768px)_and_(max-width:1024px)]:grid-cols-1
  "
      >
        {!hasProducts ? (
          <p className="text-neutral-600 col-span-full text-center">
            Ingen produkter fundet.
          </p>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variant={variant}
              onClick={() => setSelectedProduct(p)}
            />
          ))
        )}
      </section>

      {variant === "products" && selectedProduct && (
        <ProductModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={handleClose}
        />
      )}

      {variant === "order" && selectedProduct && (
        <OrderProductModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={handleClose}
          onAdd={onAddToOrder}
        />
      )}
    </>
  );
}
