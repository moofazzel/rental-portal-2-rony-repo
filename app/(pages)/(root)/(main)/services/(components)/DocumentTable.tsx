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

  return (
    <CardContent className="p-0">
      {documents.length === 0 ? (
        <div className="p-6 text-center">
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-500 font-semibold text-sm">1</span>
              </div>
              <div className="h-4 bg-slate-200 rounded w-48"></div>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-500 font-semibold text-sm">2</span>
              </div>
              <div className="h-4 bg-slate-200 rounded w-48"></div>
            </div>
          </div>
          <p className="text-sm text-slate-500">No documents available</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {documents.slice(0, 5).map((document, index) => (
            <div
              key={document._id}
              className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => handleView(document)}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-4">
                {/* Index Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2 sm:mb-0">
                  <span className="text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>
                {/* Main Content */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getFileTypeIcon(document.fileType)}
                      <h4 className="font-semibold text-slate-900 break-words max-w-xs sm:max-w-none">
                        {document.title}
                      </h4>
                    </div>
                    <Badge
                      className={`${getStatusColor(
                        document
                      )} mt-1 sm:mt-0 w-fit`}
                    >
                      {getStatusText(document)}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2 break-words">
                    {document.description || "No description provided"}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(document.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {document.uploadedBy && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-[120px] sm:max-w-none">
                          {document.uploadedBy.name}
                        </span>
                      </div>
                    )}
                    {document.propertyId?.name && (
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span className="truncate max-w-[120px] sm:max-w-none">
                          {document.propertyId.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Download Button */}
                <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(document);
                    }}
                    className="gap-1 w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden xs:inline">Download</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  );
}
