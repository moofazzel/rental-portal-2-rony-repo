"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { IDocument } from "@/types/document.types";
import {
  Building,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  User,
  XCircle,
} from "lucide-react";

interface DocumentTableProps {
  documents: IDocument[];
  onDownload?: (document: IDocument) => void;
  onDelete?: (documentId: string) => void;
}

export function DocumentTable({
  documents,
  onDownload,
  onDelete,
}: DocumentTableProps) {
  const sanitizeFileName = (name?: string, fallbackExt?: string) => {
    const base = (name || "document").replace(/[^a-zA-Z0-9._-]/g, "_");
    if (base.includes(".")) return base;
    return fallbackExt ? `${base}.${fallbackExt}` : base;
  };

  const getCloudinaryAttachmentUrl = (url: string, filename?: string) => {
    const safeName = sanitizeFileName(
      filename,
      url.toLowerCase().includes("/raw/") ? "pdf" : undefined
    );
    // Insert fl_attachment (optionally with filename) into the transformation segment
    const injection = `fl_attachment${safeName ? `:${safeName}` : ""}`;
    return url.replace("/upload/", `/upload/${injection}/`);
  };

  const handleDownload = (doc: IDocument) => {
    if (onDownload) {
      onDownload(doc);
      return;
    }
    if (!doc.fileUrl) return;
    const isCloudinary =
      doc.fileUrl.includes("res.cloudinary.com") &&
      doc.fileUrl.includes("/upload/");

    if (isCloudinary) {
      const url = getCloudinaryAttachmentUrl(doc.fileUrl, doc.fileName);
      window.open(url, "_blank");
      return;
    }

    // Fallback: try programmatic download via blob
    const fileName = sanitizeFileName(
      doc.fileName,
      doc.fileType === "PDF" ? "pdf" : undefined
    );
    fetch(doc.fileUrl)
      .then(async (res) => {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = window.document.createElement("a");
        a.href = objectUrl;
        a.download = fileName;
        window.document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
      })
      .catch(() => {
        // As a last resort, open in a new tab
        window.open(doc.fileUrl, "_blank");
      });
  };

  const handleView = (document: IDocument) => {
    if (!document.fileUrl) return;
    if (document.fileType === "PDF") {
      const inlineUrl = document.fileUrl.includes("/upload/")
        ? document.fileUrl.replace("/upload/", "/upload/fl_inline/")
        : document.fileUrl;
      window.open(inlineUrl, "_blank");
      return;
    }
    window.open(document.fileUrl, "_blank");
  };
  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return <FileText className="w-4 h-4 text-red-500" />;
      case "DOC":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "IMAGE":
        return <FileText className="w-4 h-4 text-green-500" />;
      case "VIDEO":
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return "bg-red-100 text-red-800 border-red-200";
      case "DOC":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IMAGE":
        return "bg-green-100 text-green-800 border-green-200";
      case "VIDEO":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (document: IDocument) =>
    document.isActive && !document.isExpired ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );

  const getStatusColor = (document: IDocument) => {
    if (!document.isActive) {
      return "bg-gray-200 text-gray-600 border-gray-300";
    }
    if (document.isExpired) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusText = (document: IDocument) => {
    if (!document.isActive) return "Inactive";
    if (document.isExpired) return "Expired";
    return "Active";
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "LEASE_AGREEMENT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PROPERTY_RULES":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "EMERGENCY":
        return "bg-red-100 text-red-800 border-red-200";
      case "PROPERTY_INFO":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCategory = (category?: string) => {
    if (!category) return "General";
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <CardContent className="p-0 shadow-md ">
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
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Uploaded
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="cursor-pointer">
            {documents.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No documents available yet.
                </td>
              </tr>
            )}
            {documents.map((document, index) => (
              <tr
                key={document._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition-colors duration-200`}
              >
                <td className="px-4 py-3" onClick={() => handleView(document)}>
                  <div>
                    <div className="font-medium text-gray-900">
                      {document.title}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {document.description || "No description provided"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {document.propertyId?.name || "Unknown property"}
                      </span>
                      {document.formattedFileSize && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {document.formattedFileSize}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getFileTypeIcon(document.fileType)}
                    <Badge className={getFileTypeColor(document.fileType)}>
                      {document.fileType}
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={getCategoryColor(document.category)}>
                    {formatCategory(document.category)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(document)}
                    <Badge className={getStatusColor(document)}>
                      {getStatusText(document)}
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {new Date(document.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {document.uploadedBy && (
                    <div className="flex items-center gap-1 mt-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {document.uploadedBy.name}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(document)}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(document._id)}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  );
}
