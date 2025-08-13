"use server";

import { deleteDocument, updateDocument } from "@/app/apiClient/adminApi";
import { IDocument } from "@/types/document.types";
import { revalidatePath } from "next/cache";

export async function updateDocumentAction(
  documentId: string,
  updateData: Partial<IDocument>
) {
  try {
    const result = await updateDocument(documentId, updateData);

    if (!result.success) {
      throw new Error(result.message || "Failed to update document");
    }

    revalidatePath("/admin/documents");

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Failed to update document:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update document",
    };
  }
}

export async function deleteDocumentAction(documentId: string) {
  try {
    const result = await deleteDocument(documentId);

    if (!result.success) {
      throw new Error(result.message || "Failed to delete document");
    }

    revalidatePath("/admin/documents");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete document:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete document",
    };
  }
}
