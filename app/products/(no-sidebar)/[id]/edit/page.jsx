// app/products/[id]/edit/page.jsx
import ProductForm from "@/components/ProductForm";
import { updateProductAction } from "@/actions/updateProductAction";
import { getProductById } from "@/lib/products";
import {
  getCustomizationTypesWithOptions,
  getProductCustomizationOptionIds,
} from "@/lib/customizations";

export default async function EditProductPage(props) {
  const { id } = await props.params;
  const productId = Number(id);

  const [product, customizationData, selectedCustomizationOptionIds] =
    await Promise.all([
      getProductById(productId),
      getCustomizationTypesWithOptions(),
      getProductCustomizationOptionIds(productId),
    ]);

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
      customizationData={customizationData}
      selectedCustomizationOptionIds={selectedCustomizationOptionIds}
    />
  );
}


