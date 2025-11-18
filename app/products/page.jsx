import { getAllProducts } from "@/lib/products";
import ProductsGrid from "@/components/ProductsGrid";
import CreatedModal from "@/components/CreatedProductModal";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 pt-20">
      <header className="mb-8 text-center">
        <h1 className="page-title">Produkter</h1>
      </header>

      <ProductsGrid products={products} />

      <CreatedModal />
    </main>
  );
}
