import { redirect } from "next/navigation";
import { getProductionList } from "@/lib/production";
import ProductionTable from "@/components/production/ProductionTable";
import ProductionHeader from "@/components/production/ProductionHeader";

export default async function ProductionPage({ searchParams }) {
  const params = await searchParams;

  const hasDateFilter = params.date || params.from || params.to || params.range;

  if (!hasDateFilter) {
    const now = new Date();
    const hour = now.getHours();

    const date = new Date(now);
    if (hour >= 18) {
      date.setDate(date.getDate() + 1);
    }

    const formattedDate = date.toISOString().slice(0, 10);
    redirect(`/production?date=${formattedDate}`);
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
        <ProductionHeader showPrint />

        <ProductionTable rows={rows} />
      </main>
    </div>
  );
}
