"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDocument } from "@/types/document.types";
import { Calendar, Download, Edit, Eye, FileText, Trash2 } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { DeleteDocumentModal } from "./DeleteDocumentModal";
import { EditDocumentModal } from "./EditDocumentModal";

interface DocumentTableProps {
  documents: IDocument[];
  onImageClick: (doc: IDocument) => void;
  onEdit: (
    documentId: string,
    updatedData: Partial<IDocument>
  ) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
  properties: Array<{ id: string; name: string }>;
}

export function DocumentTable({
  documents,
  onImageClick,
  onEdit,
  onDelete,
  properties,
}: DocumentTableProps) {
  const [editingDocument, setEditingDocument] = useState<IDocument | null>(
    null
  );
  const [deletingDocument, setDeletingDocument] = useState<IDocument | null>(
    null
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "LEGAL":
        return "bg-red-100 text-red-800 border-red-200";
      case "RULES":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MAINTENANCE":
        return "bg-green-100 text-green-800 border-green-200";
      case "GENERAL":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return <FileText className="w-4 h-4 text-red-500" />;
      case "DOC":
      case "DOCX":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "IMAGE":
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleEdit = (doc: IDocument) => {
    setEditingDocument(doc);
  };

  const handleDelete = (doc: IDocument) => {
    setDeletingDocument(doc);
  };

  const handleEditSave = async (
    documentId: string,
    updatedData: Partial<IDocument>
  ) => {
    await onEdit(documentId, updatedData);
    setEditingDocument(null);
  };

  const handleDeleteConfirm = async (documentId: string) => {
    await onDelete(documentId);
    setDeletingDocument(null);
  };

  const handleView = (doc: IDocument) => {
    if (doc.fileType === "IMAGE" && doc.fileUrl) {
      onImageClick(doc);
      return;
    }
    if (doc.fileType === "PDF" && doc.fileUrl) {
      // Prefer inline viewing for PDFs using Cloudinary flag
      const inlineUrl = doc.fileUrl.includes("/upload/")
        ? doc.fileUrl.replace("/upload/", "/upload/fl_inline/")
        : doc.fileUrl;
      window.open(inlineUrl, "_blank", "noopener,noreferrer");
      return;
    }
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by uploading your first document.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Documents
            <Badge variant="outline" className="ml-auto">
              {documents.length} documents
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Document
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Property
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Uploaded
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc, index) => (
                  <tr
                    key={doc._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {doc.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {doc.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {doc.fileName}
                        </div>
                        {/* Show image thumbnail for image documents */}
                        {doc.fileType === "IMAGE" && doc.fileUrl && (
                          <div className="mt-2">
                            <div
                              className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => onImageClick(doc)}
                              title="Click to view image"
                            >
                              <CldImage
                                src={doc.fileUrl}
                                alt={doc.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                crop="thumb"
                                gravity="auto"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getFileTypeIcon(doc.fileType)}
                        <span className="text-sm font-medium text-gray-600">
                          {doc.fileType}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={getCategoryColor(doc.category || "GENERAL")}
                      >
                        {doc.category || "GENERAL"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {doc.propertyId.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {formatFileSize(doc.fileSize || 0)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="View"
                          onClick={() => handleView(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {doc.fileType === "IMAGE" && doc.fileUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="View Image"
                            onClick={() => onImageClick(doc)}
                          >
                            <div className="w-4 h-4 rounded border border-gray-300 bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Edit"
                          onClick={() => handleEdit(doc)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Delete"
                          onClick={() => handleDelete(doc)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Document Modal */}
      <EditDocumentModal
        document={editingDocument}
        isOpen={!!editingDocument}
        onClose={() => setEditingDocument(null)}
        onSave={handleEditSave}
        properties={properties}
      />

      {/* Delete Document Modal */}
      <DeleteDocumentModal
        document={deletingDocument}
        isOpen={!!deletingDocument}
        onClose={() => setDeletingDocument(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
