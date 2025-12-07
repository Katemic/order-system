import ProductForm from "@/components/ProductForm";
import { updateProductAction } from "@/actions/updateProductAction";
import { getProductById } from "@/lib/products";

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
    <ProductForm
      mode="edit"
      product={product}
      action={updateProductAction}
    />
  );
}


