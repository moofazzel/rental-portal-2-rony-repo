// types/document.ts
export interface DocumentEntry {
  id: string;
  title: string;
  description: string;
  community: "design" | "marketing" | "engineering";
  fileType: "img" | "pdf" | "doc";
  fileName: string;
  uploadedAt: string;
  fileSize: string;
}
