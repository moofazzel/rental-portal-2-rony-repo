// Client-side utilities for Cloudinary URL generation
// This file doesn't use the Cloudinary SDK to avoid client-side issues

export function getSecurePdfUrl(publicId: string, cloudName?: string): string {
  const cloud = cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) {
    console.warn("Cloudinary cloud name not found");
    return publicId; // Return the public ID as fallback
  }

  // Generate a secure URL manually
  return `https://res.cloudinary.com/${cloud}/raw/upload/fl_trusted,fl_public/${publicId}.pdf`;
}

export function getCloudinaryUrl(
  publicId: string,
  format: string = "pdf",
  cloudName?: string
): string {
  const cloud = cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) {
    console.warn("Cloudinary cloud name not found");
    return publicId; // Return the public ID as fallback
  }

  // Generate a secure URL manually
  return `https://res.cloudinary.com/${cloud}/raw/upload/fl_trusted,fl_public/${publicId}.${format}`;
}

// Function to check if a PDF URL is accessible
export async function checkPdfAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error("Error checking PDF accessibility:", error);
    return false;
  }
}
