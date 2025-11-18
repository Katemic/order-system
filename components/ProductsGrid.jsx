"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function ProductsGrid({ products }) {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const hasProducts = products && products.length > 0;

    return (
        <>
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
                {!hasProducts ? (
                    <p className="text-neutral-600 col-span-full text-center">
                        Ingen produkter fundet.
                    </p>
                ) : (
                    products.map((p, i) => (
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
