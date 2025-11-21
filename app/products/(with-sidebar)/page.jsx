import { getAllProducts } from "@/lib/products";
import ProductsGrid from "@/components/ProductsGrid";
import CreatedModal from "@/components/CreatedProductModal";
import UpdatedModal from "@/components/UpdatedModal";
import NotificationBanner from "@/components/NotificationBanner";

export const dynamic = "force-dynamic";

const DEFAULT_CATEGORY = "Brød";

export default async function ProductsPage(props) {
  const params = await props.searchParams;

  const rawCategory = params?.category;
  const rawSearch = params?.search;

  const categoryParam =
    (typeof rawCategory === "string" ? rawCategory : undefined) ||
    DEFAULT_CATEGORY;

  const searchTermRaw =
    (typeof rawSearch === "string" ? rawSearch : "") || "";

  const searchTerm = searchTermRaw.toLowerCase().trim();

  const allProducts = await getAllProducts();

  let filteredProducts = allProducts;

  if (searchTerm) {
    filteredProducts = allProducts.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      return (
        name.includes(searchTerm)
      );
    });
  } else {
    filteredProducts =
      categoryParam === "Alle"
        ? allProducts
        : allProducts.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === categoryParam.toLowerCase()
        );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 pt-20">
      <header className="mb-8 text-center">
        <h1 className="page-title">Produkter</h1>
      </header>

      <ProductsGrid products={filteredProducts} />

      <CreatedModal />
      <UpdatedModal />

      <NotificationBanner />
    </main>
  );
}
