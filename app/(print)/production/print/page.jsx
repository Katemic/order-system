import { getProductionList } from "@/lib/production";
import ProductionTable from "@/components/production/ProductionTable";
import ProductionHeader from "@/components/production/ProductionHeader";
import PrintAuto from "@/components/system/PrintAuto";

export const dynamic = "force-dynamic";

export default async function ProductionPrintPage({ searchParams }) {
  const params = searchParams ? await searchParams : {};

  const rows = await getProductionList({
    date: params.date,
    from: params.from,
    to: params.to,
    productionCategory: params.production,
  });

  return (
    <main className="p-6">
      <PrintAuto />

      <ProductionHeader showPrint={false} />
      <ProductionTable rows={rows} />
    </main>
  );
}
