"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCustomizationType } from "@/lib/customizations";

export async function createCustomizationAction(prevState, formData) {
    const title = formData.get("title")?.trim() ?? "";
    const options = formData.getAll("options[]").map((o) => o.trim()).filter(Boolean);

    const fieldErrors = {};

    if (!title) fieldErrors.title = "Titel er påkrævet.";
    if (options.length === 0) fieldErrors.options = "Du skal tilføje mindst én mulighed.";

    if (Object.keys(fieldErrors).length > 0) {
        return {
            success: false,
            fieldErrors,
            values: { title, options }
        };
    }

    await createCustomizationType(title, options);

    revalidatePath("/customizations");
    redirect("/customizations?created=true");
}
