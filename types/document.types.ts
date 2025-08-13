// types/document.ts
export interface DocumentEntry {
  id: string;
  title: string;
  description: string;
  community: "design" | "marketing" | "engineering";
  fileType: "img" | "pdf" | "doc";
  fileName: string;
  fileUrl: string; // Cloudinary URL
  fileSize: string; // File size in bytes
  uploadedAt: string;
  storageProvider: "cloudinary" | "s3" | "local";
  storageKey: string; // Cloudinary public_id or storage key
  displayFileSize?: string; // Formatted file size (e.g., "2.4 MB")
}

// MongoDB Document Schema
export interface DocumentSchema {
  _id?: string;
  title: string;
  description: string;
  community: string;
  fileType: "img" | "pdf" | "doc";
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string; // User ID who uploaded
  storageProvider: "cloudinary" | "s3" | "local";
  storageKey: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface DocumentUploadResponse {
  success: boolean;
  document?: DocumentEntry;
  error?: string;
}

export interface DocumentListResponse {
  success: boolean;
  documents: DocumentEntry[];
  total: number;
  page: number;
  limit: number;
}

// New API Document Types
export type DocumentType = "PDF" | "DOC" | "IMAGE" | "VIDEO" | "OTHER";

export interface IDocument {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: DocumentType;
  fileName: string;
  fileSize?: number; // in bytes
  propertyId: {
    _id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  tags?: string[];
  category?: string; // e.g., "LEASE_AGREEMENT", "RULES", "MAINTENANCE", "GENERAL"
  expiryDate?: Date; // optional expiry date for time-sensitive documents
  createdAt: Date;
  updatedAt: Date;
  isExpired?: boolean;
  isCurrentlyActive?: boolean;
  fileExtension?: string;
  formattedFileSize?: string;
}

export interface ICreateDocument {
  title: string;
  description?: string;
  fileUrl: string;
  fileType: DocumentType;
  fileName: string;
  fileSize?: number;
  propertyId: string;
  tags?: string[];
  category?: string;
  expiryDate?: Date;
}

export interface DocumentListApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IDocument[];
}

export interface DocumentFilters {
  propertyId?: string;
  fileType?: DocumentType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  tags?: string[];
}
