import ProductForm from "@/components/ProductForm";
import { createProductAction } from "@/actions/createProductAction";

export default function CreateProductPage() {
  return (
    <ProductForm 
      mode="create"
      action={createProductAction}
    />
  );
}


