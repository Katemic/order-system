import { redirect } from "next/navigation";
import { getProductionList } from "@/lib/production";
import ProductionTable from "@/components/ProductionTable";
import ProductionHeader from "@/components/ProductionHeader";

export default async function ProductionPage({ searchParams }) {
  const params = await searchParams;

  const hasDateFilter =
    params.date || params.from || params.to || params.range;

  if (!hasDateFilter) {
    const today = new Date().toISOString().slice(0, 10);
    redirect(`/production?date=${today}`);
  }

  const rows = await getProductionList({
    date: params.date,
    from: params.from,
    to: params.to,
    productionCategory: params.production, // bager / konditor
  });

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 pt-20">
        <ProductionHeader />
        <ProductionTable rows={rows} />
      </main>
    </div>
  );
}

