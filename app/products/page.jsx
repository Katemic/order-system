import { getAllProducts } from "@/lib/products";
import ProductsGrid from "@/components/ProductsGrid";
import Link from "next/link";
import CreatedModal from "@/components/CreatedProductModal";

export const dynamic = "force-static";

export default async function ProductsPage() {
    const products = await getAllProducts();

    return (

        <main className="mx-auto max-w-7xl px-4 py-8">
            <header className="mb-8 text-center">
                <h1 className="page-title">Produkter</h1>
            </header>

             <Link
                    href="/createProduct"
                    className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                    + Opret produkt
                </Link>
            {products.length === 0 ? (
                <p className="text-center text-neutral-600">
                    Ingen produkter fundet.
                </p>
            ) : (
                <ProductsGrid products={products} />
            )}

            <CreatedModal />
        </main>
    );
}
