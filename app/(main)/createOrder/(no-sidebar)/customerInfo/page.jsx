import CustomerInfoClient from "@/components/order/CustomerInfoClient";

export const dynamic = "force-dynamic";

export default function CustomerInfoPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pt-20">
      <header className="mb-8 text-center">
        <h1 className="page-title">Kundeoplysninger</h1>
      </header>
      <CustomerInfoClient />
    </main>
  );
}
