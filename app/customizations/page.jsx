import { getCustomizationTypesWithOptions } from "@/lib/customizations";
import CustomizationsTable from "@/components/CustomizationsTable";

export const dynamic = "force-dynamic";

export default async function CustomizationsPage() {
  const customizations = await getCustomizationTypesWithOptions();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pt-20">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Tilpasninger
        </h1>
      </header>

      <CustomizationsTable customizations={customizations} />
    </main>
  );
}
