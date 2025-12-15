"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export async function updateCustomizationAction(prevState, formData) {
    

    revalidatePath("/customizations");
    redirect("/customizations?updated=true");
}