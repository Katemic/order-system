import ProductsLayoutShell from "@/components/ProductsLayoutShell";

export default function CreateOrderLayout({ children }) {
  return (
    <ProductsLayoutShell basePath="/createOrder">
      {children}
    </ProductsLayoutShell>
  );
}
