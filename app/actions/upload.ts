"use server";

import { createDocument } from "@/app/apiClient/adminApi";
import { ICreateDocument } from "@/types/document.types";
import { revalidatePath } from "next/cache";

export async function uploadDocument(documentData: ICreateDocument) {
  try {
    // Use the createDocument function from adminApi.ts
    const result = await createDocument(documentData);

    if (!result.success) {
      throw new Error(result.message || "Failed to upload document");
    }

    revalidatePath("/admin/admin-documents");

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to upload document:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to upload document",
    };
  }
}
