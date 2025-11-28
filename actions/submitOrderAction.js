"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitOrderAction(prevState, formData) {
    const errors = {};

    // ✔ REGEX til tid: fx "14", "14.00", "14:00", "14-16", "kl 14", "kl 12-14.30"
    const timeRegex = /(kl\.?\s*)?(\d{1,2}([.:]\d{2})?)(\s*-\s*(\d{1,2}([.:]\d{2})?))?/i;

    const orderDate = formData.get("orderDate")?.toString().trim() || "";
    const customerName = formData.get("customerName")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const agreedPriceRaw = formData.get("agreedPrice")?.toString().trim() || "";
    const orderedBy = formData.get("orderedBy")?.toString().trim() || "";
    const paidRaw = formData.get("paid");
    const fulfillmentType = formData.get("fulfillmentType")?.toString() || "pickup";
    const pickupTime = formData.get("pickupTime")?.toString().trim() || "";
    const address = formData.get("address")?.toString().trim() || "";
    const zip = formData.get("zip")?.toString().trim() || "";
    const deliveryTime = formData.get("deliveryTime")?.toString().trim() || "";
    const deliveryNote = formData.get("deliveryNote")?.toString().trim() || "";
    const orderNote = formData.get("orderNote")?.toString().trim() || "";

    const orderItemsRaw = formData.get("orderItems")?.toString() || "[]";

    const paid = paidRaw === "on";

    let orderItems = [];
    try {
        const parsed = JSON.parse(orderItemsRaw);
        if (Array.isArray(parsed)) {
            orderItems = parsed;
        } else {
            errors.orderItems = "Ordrelisten er ugyldig.";
        }
    } catch (err) {
        errors.orderItems = "Ordrelisten kunne ikke læses.";
    }

    if (!orderDate) {
        errors.orderDate = "Dato for bestilling er påkrævet.";
    }

    if (!customerName) {
        errors.customerName = "Navn på kunde er påkrævet.";
    }

    if (!orderedBy) {
        errors.orderedBy = "Bestilt af er påkrævet.";
    }

    if (!orderItems || orderItems.length === 0) {
        errors.orderItems = "Der skal mindst være ét produkt i bestillingen.";
    }

    if (fulfillmentType === "pickup") {
        if (!pickupTime) {
            errors.pickupTime = "Afhentningstidspunkt er påkrævet.";
        } else if (!timeRegex.test(pickupTime)) {
            errors.pickupTime =
                "Ugyldigt format. Brug fx: 14, kl 14, 14.00, 14-16.";
        }
    }

    if (fulfillmentType === "delivery") {
        if (!address) {
            errors.address = "Adresse er påkrævet.";
        }
        if (!zip) {
            errors.zip = "Postnr er påkrævet.";
        }
        if (!deliveryTime) {
            errors.deliveryTime = "Leveringstidspunkt er påkrævet.";
        } else if (!timeRegex.test(deliveryTime)) {
            errors.deliveryTime =
                "Ugyldigt format. Brug fx: 14, kl 14, 14.00, 14-16.";
        }
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: "Der er fejl i formularen. Ret venligst de markerede felter.",
            errors,
        };
    }

    const totalPrice = orderItems.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        return sum + price * qty;
    }, 0);

    const agreedPrice = agreedPriceRaw ? Number(agreedPriceRaw) : null;

    const today = new Date();
    const dateCreated = today.toISOString().slice(0, 10);

    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            customer_name: customerName,
            customer_phone: phone || null,

            date_needed: orderDate,
            date_created: dateCreated,

            taken_by: orderedBy,
            paid,
            agreed_price: agreedPrice,
            total_price: totalPrice,

            delivery_type: fulfillmentType,
            pickup_time: fulfillmentType === "pickup" ? pickupTime : null,
            delivery_time: fulfillmentType === "delivery" ? deliveryTime : null,
            delivery_address: fulfillmentType === "delivery" ? address : null,
            delivery_zip: fulfillmentType === "delivery" ? zip : null,

            note: orderNote || null,
        })
        .select()
        .single();

    if (orderError) {
        console.error("Fejl ved oprettelse af order:", orderError);
        return {
            success: false,
            message: "Der skete en fejl ved gemning af bestillingen.",
            errors: {},
        };
    }

    const itemsPayload = orderItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        item_note: item.note || null,
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

    if (itemsError) {
        console.error("Fejl ved oprettelse af order_items:", itemsError);
        await supabase.from("orders").delete().eq("id", order.id);

        return {
            success: false,
            message:
                "Bestillingen blev oprettet, men der skete en fejl ved tilføjelse af produkterne.",
            errors: {},
        };
    }

    revalidatePath("/orders");
    redirect("/orders?created=true");
}
