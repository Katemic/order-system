import { getProductById } from "@/lib/products";
import EditProductForm from "@/components/EditProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage(props) {
  const { id } = await props.params;

  const product = await getProductById(Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Produkt ikke fundet
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Rediger produkt
          </h1>

          <a
            href="/products"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Tilbage til produkter
          </a>
        </div>

        <EditProductForm product={product} />
      </div>
    </main>
  );
}

