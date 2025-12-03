import { getOrderById } from "@/lib/orders";
import { getAllProducts } from "@/lib/products";
import EditProductsClient from "@/components/editOrderProductsClient";

const DEFAULT_CATEGORY = "Brød";

export default async function EditProductsPage({ params, searchParams }) {
  // unwrap possible Promise params/searchParams
  const resolvedParams = params ? await params : {};
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const orderId = Number(resolvedParams.id);

  if (Number.isNaN(orderId)) {
    return (
      <div className="p-10 text-center text-red-600">
        Ugyldigt bestillings-id.
      </div>
    );
  }

  let order;
  try {
    order = await getOrderById(orderId);
  } catch (err) {
    return (
      <div className="p-10 text-center text-red-600">
        Fejl ved hentning af bestilling.
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center text-red-600">
        Kunne ikke finde bestillingen.
      </div>
    );
  }
  
  const categoryParam =
    typeof resolvedSearchParams?.category === "string"
      ? resolvedSearchParams.category
      : DEFAULT_CATEGORY;

  const searchTerm =
    typeof resolvedSearchParams?.search === "string"
      ? resolvedSearchParams.search.toLowerCase().trim()
      : "";

  // hent produkter
  const allProducts = await getAllProducts();
  const activeProducts = allProducts.filter((p) => p.active !== false);

  let filteredProducts = activeProducts;

  if (searchTerm) {
    filteredProducts = activeProducts.filter((p) =>
      p.name?.toLowerCase().includes(searchTerm)
    );
  } else {
    if (categoryParam === "Alle") {
      filteredProducts = activeProducts;
    } else if (categoryParam === "Arkiverede") {
      filteredProducts = allProducts.filter((p) => p.active === false);
    } else {
      filteredProducts = activeProducts.filter(
        (p) =>
          p.category?.toLowerCase() === categoryParam.toLowerCase()
      );
    }
  }

  // Map order_items til klient tilstand (guard hvis undefined)
  const mappedItems = (order.order_items || []).map((item) => ({
    productId: item.product_id,
    name: item.products?.name ?? "Ukendt produkt",
    price: item.products?.price ?? 0,
    quantity: item.quantity ?? 1,
    note: item.item_note || "",
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 pt-20">
      <header className="mb-8 text-center">
        <h1 className="page-title">Redigér produkter – Bestilling #{orderId}</h1>
      </header>

      <EditProductsClient
        orderId={orderId}
        initialItems={mappedItems}
        products={filteredProducts}
      />
    </main>
  );
}


