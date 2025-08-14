"use client";

import {
  deleteDocumentAction,
  updateDocumentAction,
} from "@/app/actions/document-actions";
import { IDocument } from "@/types/document.types";
import { useMemo, useState } from "react";
import { DocumentFilters } from "./DocumentFilters";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentTable } from "./DocumentTable";
import { ImagePreviewModal } from "./ImagePreviewModal";

interface AdminDocumentsClientProps {
  properties: Array<{ id: string; name: string }>;
  documents: IDocument[];
  onRefresh?: () => void;
}

export default function AdminDocumentsClient({
  properties,
  documents,
  onRefresh,
}: AdminDocumentsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size" | "category">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    fileName: string;
  } | null>(null);

  // Refresh documents after successful upload
  const handleDocumentUploaded = () => {
    onRefresh?.();
  };

  // Handle image click
  const handleImageClick = (doc: IDocument) => {
    if (doc.fileType === "IMAGE" && doc.fileUrl) {
      setSelectedImage({
        url: doc.fileUrl,
        title: doc.title,
        fileName: doc.fileName,
      });
    }
  };

  // Close image preview
  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  // Handle document edit
  const handleEditDocument = async (
    documentId: string,
    updatedData: Partial<IDocument>
  ) => {
    try {
      const result = await updateDocumentAction(documentId, updatedData);

      if (!result.success) {
        throw new Error(result.error || "Failed to update document");
      }

      // Refresh the documents list
      onRefresh?.();
    } catch (error) {
      console.error("Failed to update document:", error);
      throw error;
    }
  };

  // Handle document delete
  const handleDeleteDocument = async (documentId: string) => {
    try {
      const result = await deleteDocumentAction(documentId);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete document");
      }

      // Refresh the documents list
      onRefresh?.();
    } catch (error) {
      console.error("Failed to delete document:", error);
      throw error;
    }
  };

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((doc) => doc.category === categoryFilter);
    }

    // Filter by property
    if (propertyFilter !== "all") {
      filtered = filtered.filter(
        (doc) => doc.propertyId._id === propertyFilter
      );
    }

    // Filter by file type
    if (fileTypeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.fileType === fileTypeFilter);
    }

    // Sort documents
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "name":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "size":
          aValue = a.fileSize || 0;
          bValue = b.fileSize || 0;
          break;
        case "category":
          aValue = (a.category || "").toLowerCase();
          bValue = (b.category || "").toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    documents,
    searchTerm,
    categoryFilter,
    propertyFilter,
    fileTypeFilter,
    sortBy,
    sortOrder,
  ]);

  const totalDocuments = documents.length;
  const totalSize = documents.reduce(
    (acc, doc) => acc + (doc.fileSize || 0),
    0
  );
  const activeDocuments = documents.filter((doc) => doc.isActive).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header with Stats and Upload */}
      <DocumentHeader
        totalDocuments={totalDocuments}
        totalSize={totalSize}
        activeDocuments={activeDocuments}
        properties={properties}
        onUploadSuccess={handleDocumentUploaded}
      />

      {/* Filters and Search */}
      <DocumentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        propertyFilter={propertyFilter}
        setPropertyFilter={setPropertyFilter}
        fileTypeFilter={fileTypeFilter}
        setFileTypeFilter={setFileTypeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        properties={properties}
        totalDocuments={totalDocuments}
        documents={documents}
      />

      {/* Documents Table */}
      <DocumentTable
        documents={filteredDocuments}
        onImageClick={handleImageClick}
        onEdit={handleEditDocument}
        onDelete={handleDeleteDocument}
        properties={properties}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        selectedImage={selectedImage}
        onClose={closeImagePreview}
      />
    </div>
  );
}
