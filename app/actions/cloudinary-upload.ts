"use server";

import crypto from "crypto";

type CloudinaryResourceType = "image" | "raw" | "video" | "auto";

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  originalFilename?: string;
  bytes?: number;
  resourceType: CloudinaryResourceType;
  format?: string;
}

export type CloudinaryActionResult =
  | { success: true; data: CloudinaryUploadResult }
  | { success: false; error: string };

/**
 * Signed upload to Cloudinary using server-side credentials.
 * Expects a FormData with fields: file (File), optional folder (string)
 */
export async function uploadToCloudinaryAction(
  formData: FormData
): Promise<CloudinaryActionResult> {
  try {
    const file = formData.get("file");
    const folderFromForm = formData.get("folder");
    const folder =
      typeof folderFromForm === "string" && folderFromForm.length > 0
        ? folderFromForm
        : "documents";

    if (!(file instanceof File)) {
      return { success: false, error: "No file provided" };
    }

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        success: false,
        error: "Cloudinary credentials are missing on server",
      };
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Build signature using parameters to send (sorted keys): folder, timestamp
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    // Decide resource type: images go to image endpoint, others (pdf/doc) to raw
    const mimeType = (file as File).type || "";
    const resourceType: CloudinaryResourceType = mimeType.startsWith("image/")
      ? "image"
      : "raw";

    const serverForm = new FormData();
    serverForm.append("file", file);
    serverForm.append("folder", folder);
    serverForm.append("timestamp", timestamp);
    serverForm.append("api_key", apiKey);
    serverForm.append("signature", signature);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    const resp = await fetch(endpoint, {
      method: "POST",
      body: serverForm,
    });

    if (!resp.ok) {
      let detail = "";
      try {
        const errJson = (await resp.json()) as { error?: { message?: string } };
        detail = errJson?.error?.message || JSON.stringify(errJson);
      } catch {
        detail = await resp.text();
      }
      return { success: false, error: `${resp.status} ${detail}` };
    }

    const json = (await resp.json()) as {
      secure_url?: string;
      public_id?: string;
      original_filename?: string;
      bytes?: number;
      resource_type?: CloudinaryResourceType;
      format?: string;
    };

    return {
      success: true,
      data: {
        secureUrl: json.secure_url || "",
        publicId: json.public_id || "",
        originalFilename: json.original_filename,
        bytes: json.bytes,
        resourceType: json.resource_type || "auto",
        format: json.format,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
