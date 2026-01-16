import { getCustomizationTypesWithOptions } from "@/lib/customizations";
import Link from "next/link";
import NotificationBanner from "@/components/system/NotificationBanner";
import CustomizationsTableWrapper from "@/components/customization/CustomizationsTableWrapper";
import { getProfile } from "@/lib/authorization";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function CustomizationsPage() {
  const { profile } = await getProfile();
  const isAdmin = profile?.admin;

  if (!isAdmin) redirect("/forbidden");

  const customizations = await getCustomizationTypesWithOptions();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pt-20">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="page-title">Tilpasninger</h1>
        <Link
          href="/createCustomization"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
        >
          Opret ny tilpasning
        </Link>
      </header>
      <div>
        <CustomizationsTableWrapper customizations={customizations} />
      </div>
      <NotificationBanner />
    </main>
  );
}
