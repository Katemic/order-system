import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import EditCustomerInfoClient from "@/components/EditCustomerInfoClient";

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
            <h1 className="page-title mb-6">Rediger kundeoplysninger</h1>
            <EditCustomerInfoClient initialOrder={order} />
        </main>
    );
}
