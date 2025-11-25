"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import OrderProductModal from "./OrderProductModal";

export default function ProductsGrid({ products, variant = "products" }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [, setOrderItems] = useState([]);

    const hasProducts = products && products.length > 0;

    const handleClose = () => setSelectedProduct(null);

    const handleAddToOrder = ({ product, quantity, note }) => {
        const item = {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            note,
        };

        setOrderItems((prev) => {
            const updated = [...prev, item];
            console.log("Order items:", updated);
            return updated;
        });
    };

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
                            variant={variant}
                            onClick={() => setSelectedProduct(p)}
                        />
                    ))
                )}
            </section>

            {variant === "products" && (
                <ProductModal product={selectedProduct} onClose={handleClose} />
            )}

            {variant === "order" && selectedProduct && (
                <OrderProductModal
                    key={selectedProduct.id}
                    product={selectedProduct}
                    onClose={handleClose}
                    onAdd={handleAddToOrder}
                />
            )}
        </>
    );
}
