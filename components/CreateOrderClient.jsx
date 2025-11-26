"use client";

import { useState } from "react";
import ProductsGrid from "./ProductsGrid";
import OrderSummary from "./OrderSummary";

export default function CreateOrderClient({ products }) {
    const [orderItems, setOrderItems] = useState([]);

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
            <OrderSummary items={orderItems} onReset={handleReset} />
        </div>
    );
}
