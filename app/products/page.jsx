import { getAllProducts } from "@/lib/products";
import ProductsGrid from "@/components/ProductsGrid";

export const dynamic = "force-static";

export default async function ProductsPage() {
    const products = await getAllProducts();

    return (
        <main className="mx-auto max-w-7xl px-4 py-8">
            <header className="mb-8 text-center">
                <h1 className="page-title">Produkter</h1>
            </header>

            {products.length === 0 ? (
                <p className="text-center text-neutral-600">
                    Ingen produkter fundet.
                </p>
            ) : (
                <ProductsGrid products={products} />
            )}
        </main>
    );
}
