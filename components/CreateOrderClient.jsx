"use client";

import { useState, useEffect } from "react";
import ProductsGrid from "./ProductsGrid";
import OrderSummary from "./OrderSummary";

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

    useEffect(() => {
        try {
            window.localStorage.setItem("orderItems", JSON.stringify(orderItems));
        } catch (err) {
            console.error("Kunne ikke gemme orderItems i localStorage:", err);
        }
    }, [orderItems]);

    return (
        <div className="flex gap-8 items-start">
            <div className="flex-1">
                <ProductsGrid
                    products={products}
                    variant="order"
                    onAddToOrder={handleAddToOrder}
                />
            </div>
            <OrderSummary items={orderItems} onReset={handleReset} />
        </div>
    );
}
