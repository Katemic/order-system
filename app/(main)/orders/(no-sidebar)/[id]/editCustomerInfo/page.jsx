import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import EditCustomerInfoClient from "@/components/EditCustomerInfoClient";
import Link from "next/link";

export default async function EditCustomerInfoPage({ params }) {
    const { id } = await params;

    const numericId = Number(id);
    if (!id || Number.isNaN(numericId)) {
        notFound();
    }

    const order = await getOrderById(numericId);

    if (!order) {
        notFound();
    }

    return (
<main className="mx-auto max-w-5xl px-4 py-8 pt-20 space-y-6">
            
            {/* Header med tilbage-knap */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="page-title">Rediger kundeoplysninger</h1>

                <Link
                    href="/orders"
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    Tilbage til bestillinger
                </Link>
            </div>

            <EditCustomerInfoClient initialOrder={order} />
        </main>
    );
}
