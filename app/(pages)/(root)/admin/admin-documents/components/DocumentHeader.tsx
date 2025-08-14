"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderOpen } from "lucide-react";
import { UploadDocumentModal } from "./UploadDocumentModal";

interface DocumentHeaderProps {
  totalDocuments: number;
  totalSize: number;
  activeDocuments: number;
  properties: Array<{ id: string; name: string }>;
  onUploadSuccess: () => void;
}

export function DocumentHeader({
  totalDocuments,
  totalSize,
  activeDocuments,
  properties,
  onUploadSuccess,
}: DocumentHeaderProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Document Management
            </h1>
            <p className="text-gray-600">
              Upload and manage documents for your properties and tenants
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3">
          <Card className="min-w-[90px] p-0 border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-blue-600">
                {totalDocuments}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Total Documents
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] p-0 border-l-4 border-l-green-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-green-600">
                {activeDocuments}
              </div>
              <div className="text-xs text-gray-500 font-medium">Active</div>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] p-0 border-l-4 border-l-purple-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-purple-600">
                {formatFileSize(totalSize)}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Total Size
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Property Navigation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Properties
          </CardTitle>

          {/* Upload Document Modal */}
          <UploadDocumentModal
            properties={properties}
            onUploadSuccess={onUploadSuccess}
          />
        </CardHeader>
      </Card>
    </>
  );
}
