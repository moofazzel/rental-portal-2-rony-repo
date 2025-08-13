"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  File,
  FileText,
  Image,
  Loader2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadProps {
  onUploadComplete?: (url: string, publicId: string) => void;
  onUploadError?: (error: string) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  multiple?: boolean;
  uploadPreset?: string;
  className?: string;
}

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: "pending" | "uploading" | "success" | "error";
  cloudinaryUrl?: string;
  publicId?: string;
}

const DEFAULT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/avi",
  "video/mov",
  "video/wmv",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const DEFAULT_MAX_FILE_SIZE = 10; // 10MB

export default function FileUpload({
  onUploadComplete,
  onUploadError,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  multiple = false,
  uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    "ml_default",
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${
          file.type
        } is not supported. Accepted types: ${acceptedTypes.join(", ")}`,
      };
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return {
        isValid: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(
          2
        )}MB exceeds maximum size of ${maxFileSize}MB`,
      };
    }

    return { isValid: true };
  };

  const createFilePreview = (file: File): string | undefined => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return undefined;
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      const validation = validateFile(file);

      if (validation.isValid) {
        const fileWithPreview: FileWithPreview = {
          ...file,
          preview: createFilePreview(file),
          uploadProgress: 0,
          uploadStatus: "pending",
        };
        newFiles.push(fileWithPreview);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      onUploadError?.(errors.join("\n"));
    }

    if (newFiles.length > 0) {
      setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));
    }
  };

  const uploadToCloudinary = async (
    file: FileWithPreview
  ): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Update status to uploading
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, uploadStatus: "uploading" as const } : f
          )
        );

        const result = await uploadToCloudinary(file);

        // Update status to success
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? {
                  ...f,
                  uploadStatus: "success" as const,
                  cloudinaryUrl: result.url,
                  publicId: result.publicId,
                  uploadProgress: 100,
                }
              : f
          )
        );

        onUploadComplete?.(result.url, result.publicId);
        return result;
      } catch (error) {
        // Update status to error
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? {
                  ...f,
                  uploadStatus: "error" as const,
                  uploadProgress: 0,
                }
              : f
          )
        );

        onUploadError?.(`Failed to upload ${file.name}: ${error}`);
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Clean up preview URL
      if (prev[index]?.preview) {
        URL.revokeObjectURL(prev[index].preview!);
      }
      return newFiles;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/"))
      return <Image className="w-8 h-8 text-blue-500" />;
    if (fileType.startsWith("video/"))
      return <Video className="w-8 h-8 text-purple-500" />;
    if (fileType.includes("pdf"))
      return <FileText className="w-8 h-8 text-red-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "uploading":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            File Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: {acceptedTypes.join(", ")} (Max: {maxFileSize}
              MB)
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={acceptedTypes.join(",")}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">
                Selected Files ({files.length})
              </h3>
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50"
                >
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      {getStatusIcon(file.uploadStatus || "pending")}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.type}</span>
                    </div>

                    {/* Upload Progress */}
                    {file.uploadStatus === "uploading" && (
                      <Progress
                        value={file.uploadProgress || 0}
                        className="mt-2 h-1"
                      />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {file.uploadStatus === "success" && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Uploaded
                      </Badge>
                    )}
                    {file.uploadStatus === "error" && (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-800"
                      >
                        Failed
                      </Badge>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={file.uploadStatus === "uploading"}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {files.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={
                  isUploading ||
                  files.every((f) => f.uploadStatus === "success")
                }
                className="min-w-[120px]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Upload Results */}
          {files.some((f) => f.uploadStatus === "success") && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Files uploaded successfully! You can now use the provided URLs.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
