"use client";

import {
  uploadToCloudinaryAction,
  type CloudinaryUploadResult,
} from "@/app/actions/cloudinary-upload";
import { uploadDocument } from "@/app/actions/upload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ICreateDocument } from "@/types/document.types";
import {
  AlertCircle,
  CheckCircle,
  File,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { CldImage } from "next-cloudinary";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";

interface UploadDocumentModalProps {
  trigger?: React.ReactNode;
  properties?: Array<{ id: string; name: string }>;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUploadSuccess?: () => void;
}

export interface UploadDocumentData {
  title: string;
  description: string;
  community: string;
  fileType: string;
  file: File | null;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  fileName?: string;
  fileSize?: number;
}

interface ValidationError {
  field: string;
  message: string;
}

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const SUPPORTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".jpg", ".jpeg"];
const SUPPORTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
];

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
const validateFile = (file: File): ValidationError | null => {
  // Check if file exists
  if (!file) {
    return { field: "file", message: "Please select a file to upload." };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      field: "file",
      message: `File size must be less than 2MB. Current size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`,
    };
  }

  // Check file extension
  const extension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    return {
      field: "file",
      message: `Unsupported file type. Supported types: ${SUPPORTED_EXTENSIONS.join(
        ", "
      )}`,
    };
  }

  // Check MIME type
  if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
    return {
      field: "file",
      message:
        "File type does not match the file extension. Please check your file.",
    };
  }

  // Check for empty file
  if (file.size === 0) {
    return {
      field: "file",
      message: "File is empty. Please select a valid file.",
    };
  }

  return null;
};

export function UploadDocumentModal({
  trigger,
  properties = [],
  isOpen,
  onOpenChange,
  onUploadSuccess,
}: UploadDocumentModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<UploadDocumentData>({
    title: "",
    description: "",
    community: "",
    fileType: "",
    file: null,
  });
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
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isControlled = isOpen !== undefined;
  const modalOpen = isControlled ? isOpen : open;
  const setModalOpen = isControlled ? onOpenChange : setOpen;

  // Helper function to get error message for a field
  const getFieldError = (field: string): string | undefined => {
    return errors.find((error) => error.field === field)?.message;
  };

  // Helper function to clear errors for a field
  const clearFieldError = (field: string) => {
    setErrors((prev) => prev.filter((error) => error.field !== field));
  };

  const handleTitleChange = (value: string) => {
    clearFieldError("title");
    setFormData((prev) => ({ ...prev, title: value }));
  };

  const handleCommunityChange = (value: string) => {
    clearFieldError("community");
    setFormData((prev) => ({ ...prev, community: value }));
  };

  const handleFileUpload = useCallback((file: File) => {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError.message);
      setErrors([validationError]);
      return;
    }

    // Clear file error and set file
    setErrors((prev) => prev.filter((error) => error.field !== "file"));
    setSelectedFile(file);

    // Update form data
    const fileType = getFileTypeFromFile(file);
    setFormData((prev) => ({
      ...prev,
      file: file,
      fileType: fileType,
      fileName: file.name,
      fileSize: file.size,
    }));

    // Reset upload status
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
    setFormData((prev) => ({
      ...prev,
      file: null,
      fileType: "",
      cloudinaryUrl: undefined,
      cloudinaryPublicId: undefined,
    }));
    clearFieldError("file");
  };

  const handleFileUploadWithProgress = async (file: File) => {
    if (!file) return null;

    setUploadStatus("uploading");
    setUploadProgress(0);
    clearFieldError("file");

    // Simulate upload progress
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

        // Update form data with Cloudinary info
        setFormData((prev) => ({
          ...prev,
          cloudinaryUrl: data.secureUrl,
          cloudinaryPublicId: data.publicId,
        }));

        clearFieldError("file");
        toast.success("File uploaded successfully!");
        return data.secureUrl;
      } else {
        setUploadStatus("error");
        console.error("Upload failed:", uploadResult.error);
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

  const handleUpload = async (documentData: UploadDocumentData) => {
    try {
      // Prepare data for backend API
      const backendData: ICreateDocument = {
        title: documentData.title,
        description: documentData.description,
        fileUrl: documentData.cloudinaryUrl!,
        fileType: documentData.fileType as
          | "PDF"
          | "DOC"
          | "IMAGE"
          | "VIDEO"
          | "OTHER",
        fileName: documentData.fileName!,
        fileSize: documentData.fileSize!,
        propertyId: documentData.community,
        tags: ["document", "uploaded"], // Default tags - can be enhanced later
        category: "GENERAL", // Default category - can be enhanced later
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      };

      console.log("Uploading document to backend:", backendData);

      // Use server action to upload document
      const result = await uploadDocument(backendData);

      if (!result.success) {
        throw new Error(result.error || "Failed to upload document");
      }

      console.log("Document uploaded successfully:", result.data);

      // Set success state
      setIsSuccess(true);

      // Call the success callback to refresh the documents list
      onUploadSuccess?.();

      // TODO: Refresh the documents list or add the new document to the state
      // You can either:
      // 1. Refetch all documents from the API
      // 2. Add the new document to the local state
    } catch (error) {
      console.error("Failed to upload document:", error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear all previous errors
    setErrors([]);

    // Basic validation
    const validationErrors: ValidationError[] = [];

    if (!formData.title.trim()) {
      validationErrors.push({
        field: "title",
        message: "Document title is required.",
      });
    }

    if (!formData.community) {
      validationErrors.push({
        field: "community",
        message: "Please select a community.",
      });
    }

    if (!selectedFile) {
      validationErrors.push({
        field: "file",
        message: "Please select a file to upload.",
      });
    }

    // Check if file is uploaded to Cloudinary
    if (!cloudinaryResult && uploadStatus !== "success") {
      validationErrors.push({
        field: "file",
        message: "Please upload the file to cloud storage before submitting.",
      });
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload file if present and not already uploaded
      if (selectedFile && uploadStatus !== "success") {
        const uploadedUrl = await handleFileUploadWithProgress(selectedFile);
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      // Call the internal upload handler
      await handleUpload(formData);

      // Show success for a moment before closing
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setErrors([
        {
          field: "general",
          message:
            error instanceof Error
              ? error.message
              : "Failed to save document. Please try again.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      community: "",
      fileType: "",
      file: null,
    });
    setSelectedFile(null);
    setCloudinaryResult(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setIsDragOver(false);
    setIsSubmitting(false);
    setIsSuccess(false);
    setErrors([]);
    setModalOpen?.(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeBadgeVariant = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return "destructive";
      case "DOC":
        return "default";
      case "IMAGE":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-[85vh] p-0 overflow-hidden">
        <form className="flex h-full min-h-0 flex-col" onSubmit={handleSubmit}>
          <DialogHeader className="sticky top-0 z-10 px-6 py-4 border-b bg-background">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
              <FileText className="h-5 w-5 text-blue-600" />
              Upload New Document
            </DialogTitle>
            <DialogDescription>
              Fill out the form below to upload a new document to the system.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 px-6 py-6">
            <div className="space-y-6">
              {/* General Error Display */}
              {getFieldError("general") && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {getFieldError("general")}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Display */}
              {isSuccess && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Document uploaded successfully! The modal will close
                    shortly.
                  </AlertDescription>
                </Alert>
              )}
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Document Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter document title..."
                  required
                  maxLength={100}
                  className={getFieldError("title") ? "border-red-500" : ""}
                />
                {getFieldError("title") && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription className="text-sm">
                      {getFieldError("title")}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Write a brief description..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 text-right">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Community Selection */}
              <div className="space-y-2">
                <Label htmlFor="community">Community *</Label>
                <Select
                  value={formData.community}
                  onValueChange={handleCommunityChange}
                  required
                >
                  <SelectTrigger
                    className={
                      getFieldError("community") ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Choose Community" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.length === 0 ? (
                      <SelectItem value="" disabled>
                        No communities available
                      </SelectItem>
                    ) : (
                      properties.map((prop) => (
                        <SelectItem key={prop.id} value={prop.id}>
                          {prop.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {getFieldError("community") && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription className="text-sm">
                      {getFieldError("community")}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-orange-600" />
                    Upload Document
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                        <span className="font-medium">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        PDF, DOC, DOCX, JPG, JPEG files only (Max 2MB)
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="fileInput"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                      >
                        Select File
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
                          <div className="flex gap-2">
                            {cloudinaryResult && uploadStatus === "success" && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    cloudinaryResult.secure_url,
                                    "_blank"
                                  )
                                }
                              >
                                View
                              </Button>
                            )}
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
                      </div>

                      {/* Upload Progress */}
                      {uploadStatus === "uploading" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Uploading...</span>
                            <span className="text-gray-500">
                              {uploadProgress}%
                            </span>
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
                              File is ready to be saved with document
                              information
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
                        formData.fileType === "IMAGE" &&
                        formData.cloudinaryPublicId && (
                          <div className="flex justify-center">
                            <div className="relative">
                              <CldImage
                                src={formData.cloudinaryPublicId}
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
                          onClick={() =>
                            handleFileUploadWithProgress(selectedFile)
                          }
                          className="w-full"
                        >
                          Upload Document
                        </Button>
                      )}

                      {/* Retry Button */}
                      {uploadStatus === "error" && (
                        <Button
                          type="button"
                          onClick={() =>
                            handleFileUploadWithProgress(selectedFile)
                          }
                          variant="outline"
                          className="w-full"
                        >
                          Retry Upload
                        </Button>
                      )}
                    </div>
                  )}
                  {getFieldError("file") && (
                    <Alert variant="destructive" className="py-2 mt-4">
                      <AlertCircle className="h-3 w-3" />
                      <AlertDescription className="text-sm">
                        {getFieldError("file")}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <DialogFooter className="sticky bottom-0 z-10 gap-3 px-6 py-4 border-t bg-background sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                uploadStatus === "uploading" ||
                isSuccess ||
                !formData.title.trim() ||
                !formData.community ||
                !selectedFile ||
                (uploadStatus !== "success" && !cloudinaryResult) ||
                properties.length === 0
              }
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {uploadStatus === "uploading"
                ? "Uploading..."
                : isSubmitting
                ? "Saving Document..."
                : isSuccess
                ? "Document Saved Successfully!"
                : "Save Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
