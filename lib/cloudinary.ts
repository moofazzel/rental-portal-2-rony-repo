import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  created_at: string;
}

export async function uploadDocument(
  file: Buffer,
  fileName: string,
  fileType: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "documents",
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, "")}`,
        format: fileType === "application/pdf" ? "pdf" : "doc",
        allowed_formats: ["pdf", "doc", "docx"],
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result as UploadResult);
        }
      }
    );

    uploadStream.end(file);
  });
}

export async function deleteDocument(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "raw" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary delete error:", error);
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getCloudinaryUrl(
  publicId: string,
  format: string = "pdf"
): string {
  return cloudinary.url(publicId, {
    resource_type: "raw",
    format: format,
    secure: true,
    flags: "attachment", // Forces download instead of preview
  });
}
