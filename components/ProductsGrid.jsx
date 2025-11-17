"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

const DEFAULT_CATEGORY = "Brød";

export default function ProductsGrid({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || DEFAULT_CATEGORY;

  const filteredProducts =
    selectedCategory === "Alle"
      ? products
      : products.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
        {filteredProducts.length === 0 ? (
          <p className="text-neutral-600 col-span-full text-center">
            Ingen produkter fundet i kategorien &quot;{selectedCategory}&quot;.
          </p>
        ) : (
          filteredProducts.map((p, i) => (
            <ProductCard
              key={i}
              product={p}
              onClick={() => setSelectedProduct(p)}
            />
          ))
        )}
      </section>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
