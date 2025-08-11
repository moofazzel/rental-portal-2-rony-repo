"use server";

import { uploadSchema } from "@/zod/document.validation";
import { promises as fs } from "fs";
import path from "path";

export type UploadFormState = {
  success: boolean;
  errors?: Record<string, string[]>;
};

const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
const allowedDocTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5MB

export async function handleUpload(
  prevState: UploadFormState,
  formData: FormData
): Promise<UploadFormState> {
  const file = formData.get("file") as File;

  const raw = {
    title: (formData.get("title") as string)?.trim() || "",
    description: (formData.get("description") as string)?.trim() || "",
    community: formData.get("community") as string,
    fileType: formData.get("fileType") as string,
  };

  const result = uploadSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // ✅ Manual file validation
  const errors: Record<string, string[]> = {};

  if (!file || file.size === 0) {
    errors.file = ["File is required"];
  } else {
    const type = file.type;

    if (type === "application/json") {
      errors.file = ["Google Docs shortcut (.gdoc) is not supported"];
    } else if (allowedImageTypes.includes(type)) {
      if (file.size > MAX_IMAGE_SIZE) {
        errors.file = ["Images must be under 2MB"];
      }
    } else if (allowedDocTypes.includes(type)) {
      if (file.size > MAX_DOC_SIZE) {
        errors.file = ["PDF/DOC must be under 5MB"];
      }
    } else {
      errors.file = ["Unsupported file type"];
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // ✅ Save file to public/uploads
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadPath = path.join(process.cwd(), "public/uploads", file.name);
  await fs.writeFile(uploadPath, buffer);

  // ✅ Console all form values together
  const fullData = {
    ...raw,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
    },
  };

  console.log("📥 Full Upload Data:", fullData);

  return { success: true };
}
