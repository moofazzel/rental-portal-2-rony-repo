"use client";

import {
  uploadToCloudinaryAction,
  type CloudinaryUploadResult,
} from "@/app/actions/cloudinary-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IDocument } from "@/types/document.types";
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  File,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DeleteDocumentModal } from "./DeleteDocumentModal";

interface EditDocumentModalProps {
  document: IDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    documentId: string,
    updatedData: Partial<IDocument>
  ) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
  onDeleteComplete: () => void;
  properties: Array<{ id: string; name: string }>;
}

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const SUPPORTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".jpg", ".jpeg"];

// Function to get file type from file extension
const getFileTypeFromFile = (file: File): string => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "PDF";
    case "doc":
    case "docx":
      return "DOC";
    case "jpg":
    case "jpeg":
      return "IMAGE";
    default:
      return "OTHER";
  }
};

// Function to validate file
const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return `File size must be less than 2MB. Current size: ${(
      file.size /
      1024 /
      1024
    ).toFixed(2)}MB`;
  }

  const extension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    return `Unsupported file type. Supported types: ${SUPPORTED_EXTENSIONS.join(
      ", "
    )}`;
  }

  if (file.size === 0) {
    return "File is empty. Please select a valid file.";
  }

  return null;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function EditDocumentModal({
  document,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onDeleteComplete,
  properties,
}: EditDocumentModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "GENERAL",
    propertyId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cloudinaryResult, setCloudinaryResult] = useState<{
    secure_url: string;
    public_id: string;
  } | null>(null);

  // Reset form when document changes
  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title,
        description: document.description || "",
        category: document.category || "GENERAL",
        propertyId: document.propertyId._id,
      });
      // Reset file upload state
      setSelectedFile(null);
      setCloudinaryResult(null);
      setUploadProgress(0);
      setUploadStatus("idle");
      setIsDragOver(false);
    }
  }, [document]);

  const handleFileUpload = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
    setUploadStatus("idle");
    setCloudinaryResult(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setCloudinaryResult(null);
    setUploadProgress(0);
    setUploadStatus("idle");
  };

  const handleFileUploadWithProgress = async (file: File) => {
    if (!file) return null;

    setUploadStatus("uploading");
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "documents");

      const uploadResult = await uploadToCloudinaryAction(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadResult.success) {
        setUploadStatus("success");
        const data: CloudinaryUploadResult = uploadResult.data;

        setCloudinaryResult({
          secure_url: data.secureUrl,
          public_id: data.publicId,
        });

        toast.success("File uploaded successfully!");
        return data.secureUrl;
      } else {
        setUploadStatus("error");
        toast.error(
          `Failed to upload file: ${uploadResult.error || "Unknown error"}`
        );
        return null;
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus("error");
      setUploadProgress(0);
      toast.error("Upload failed. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    setIsLoading(true);
    setError("");

    try {
      // Upload new file if selected and not already uploaded
      let newFileUrl = document.fileUrl;
      if (selectedFile && uploadStatus !== "success") {
        const uploadedUrl = await handleFileUploadWithProgress(selectedFile);
        if (!uploadedUrl) {
          setIsLoading(false);
          return;
        }
        newFileUrl = uploadedUrl;
      } else if (cloudinaryResult && uploadStatus === "success") {
        newFileUrl = cloudinaryResult.secure_url;
      }

      const fileType = selectedFile
        ? getFileTypeFromFile(selectedFile)
        : document.fileType;
      const fileName = selectedFile ? selectedFile.name : document.fileName;
      const fileSize = selectedFile ? selectedFile.size : document.fileSize;

      await onSave(document._id, {
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        propertyId: formData.propertyId,
        fileUrl: newFileUrl,
        fileType: fileType as any,
        fileName: fileName,
        fileSize: fileSize,
      } as any);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update document"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setIsLoading(false);
    setShowDeleteConfirm(false);
    setSelectedFile(null);
    setCloudinaryResult(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setIsDragOver(false);
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async (documentId: string) => {
    try {
      await onDelete(documentId);
      setShowDeleteConfirm(false);
      onDeleteComplete();
    } catch (err) {
      // Error will be handled by DeleteDocumentModal
    }
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-600" />
            Edit Document
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter document title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="LEGAL">Legal</SelectItem>
                  <SelectItem value="RULES">Rules</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter document description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="property">Property</Label>
            <Select
              value={formData.propertyId}
              onValueChange={(value) =>
                setFormData({ ...formData, propertyId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Re-upload File Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-orange-600" />
                Re-upload Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Show current file */}
              {!selectedFile && (
                <div className="mb-4">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center gap-3">
                      <File className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Current Document
                        </p>
                        <p className="text-xs text-gray-500">
                          {document.fileName} ({document.fileType})
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(document.fileSize || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* File upload area */}
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    PDF, DOC, DOCX, JPG, JPEG files only (Max 2MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="reUploadFileInput"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.document
                        .getElementById("reUploadFileInput")
                        ?.click()
                    }
                  >
                    Select New File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploadStatus === "uploading" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Uploading...</span>
                        <span className="text-gray-500">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* Upload Success */}
                  {uploadStatus === "success" && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Upload Successful
                        </p>
                        <p className="text-xs text-green-600">
                          New file is ready to replace the current document
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Upload Error */}
                  {uploadStatus === "error" && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Upload Failed
                        </p>
                        <p className="text-xs text-red-600">
                          Please try uploading again
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Display uploaded image if it's an image file */}
                  {cloudinaryResult &&
                    getFileTypeFromFile(selectedFile) === "IMAGE" &&
                    cloudinaryResult.public_id && (
                      <div className="flex justify-center">
                        <div className="relative">
                          <CldImage
                            src={cloudinaryResult.public_id}
                            width={200}
                            height={150}
                            alt={selectedFile?.name || "Uploaded image"}
                            className="rounded-lg border border-gray-200"
                            crop="thumb"
                            gravity="auto"
                            onError={(error) => {
                              console.log("Image preview error:", error);
                            }}
                          />
                        </div>
                      </div>
                    )}

                  {/* Upload Button */}
                  {selectedFile && uploadStatus === "idle" && (
                    <Button
                      type="button"
                      onClick={() => handleFileUploadWithProgress(selectedFile)}
                      className="w-full"
                    >
                      Upload New Document
                    </Button>
                  )}

                  {/* Retry Button */}
                  {uploadStatus === "error" && (
                    <Button
                      type="button"
                      onClick={() => handleFileUploadWithProgress(selectedFile)}
                      variant="outline"
                      className="w-full"
                    >
                      Retry Upload
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <Button
                title="Delete document"
                type="button"
                size="lg"
                variant="destructive"
                onClick={handleDeleteClick}
                disabled={isLoading || uploadStatus === "uploading"}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {/* View Current Document */}
              {!selectedFile && document.fileUrl && (
                <Button
                  title="View current document"
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => window.open(document.fileUrl, "_blank")}
                  disabled={isLoading || uploadStatus === "uploading"}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {/* View New Uploaded File */}
              {cloudinaryResult &&
                uploadStatus === "success" &&
                selectedFile && (
                  <Button
                    title="View new uploaded document"
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() =>
                      window.open(cloudinaryResult.secure_url, "_blank")
                    }
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View New
                  </Button>
                )}
            </div>
            <div className="flex gap-3">
              <Button
                title="Cancel"
                size="lg"
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || uploadStatus === "uploading"}
                title="Update Document"
                size="lg"
              >
                {uploadStatus === "uploading"
                  ? "Uploading..."
                  : isLoading
                  ? "Updating..."
                  : "Update Document"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>

      {/* Delete Confirmation Modal */}
      <DeleteDocumentModal
        document={document}
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Dialog>
  );
}
