"use client";

import {
  uploadToCloudinaryAction,
  type CloudinaryUploadResult,
} from "@/app/actions/cloudinary-upload";
import { uploadDocument } from "@/app/actions/upload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";
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
import { AlertCircle, CheckCircle, FileText, Upload, X } from "lucide-react";
import { CldImage } from "next-cloudinary";
import React, { useEffect, useState } from "react";

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
  interface CloudinaryEventSuccess {
    event: "success";
    info: { secure_url: string; public_id: string };
  }

  const [cloudinaryResult, setCloudinaryResult] =
    useState<CloudinaryEventSuccess | null>(null);
  const [isUploadingToCloudinary, setIsUploadingToCloudinary] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setErrors([validationError]);
        return;
      }

      // Clear file error and set file
      clearFieldError("file");
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

      // Automatically start Cloudinary upload
      setIsUploadingToCloudinary(true);
    }
  };

  // Auto-upload to Cloudinary when file is selected (via server action, signed upload)
  const autoUploadToCloudinary = async () => {
    if (!selectedFile) return;

    setIsUploadingToCloudinary(true);
    setUploadProgress(0);
    clearFieldError("file");

    // Progress shim (visual only)
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
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("folder", "documents");

      const result = await uploadToCloudinaryAction(fd);

      if (!result.success) {
        throw new Error(result.error || "Cloudinary upload failed");
      }

      const data: CloudinaryUploadResult = result.data;

      clearInterval(progressInterval);
      setUploadProgress(100);

      handleCloudinaryUpload({
        event: "success",
        info: { secure_url: data.secureUrl, public_id: data.publicId },
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      clearInterval(progressInterval);
      setIsUploadingToCloudinary(false);
      setUploadProgress(0);

      setErrors([
        {
          field: "file",
          message:
            err instanceof Error
              ? err.message
              : "File upload to Cloudinary failed. Please try again.",
        },
      ]);
    }
  };

  // Auto-upload when selectedFile changes
  useEffect(() => {
    if (selectedFile && !cloudinaryResult) {
      autoUploadToCloudinary();
    }
  }, [selectedFile]);

  const handleCloudinaryUpload = (result: CloudinaryEventSuccess) => {
    console.log("Cloudinary upload result:", result);

    if (result.event === "success") {
      setCloudinaryResult(result);
      setIsUploadingToCloudinary(false);
      setUploadProgress(0);

      // Update form data with Cloudinary info
      setFormData((prev) => ({
        ...prev,
        cloudinaryUrl: result.info.secure_url,
        cloudinaryPublicId: result.info.public_id,
      }));

      clearFieldError("file");
    } else if (result.event === "queues-end") {
      setIsUploadingToCloudinary(false);
      setUploadProgress(0);
    } else if (result.event === "close") {
      setIsUploadingToCloudinary(false);
      setUploadProgress(0);
    }
  };

  const handleCloudinaryError = (error: unknown) => {
    console.error("Cloudinary upload error:", error);
    setIsUploadingToCloudinary(false);
    setUploadProgress(0);
    setErrors([
      {
        field: "file",
        message: "File upload to Cloudinary failed. Please try again.",
      },
    ]);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setCloudinaryResult(null);
    setUploadProgress(0);
    setIsUploadingToCloudinary(false);
    setFormData((prev) => ({
      ...prev,
      file: null,
      fileType: "",
      cloudinaryUrl: undefined,
      cloudinaryPublicId: undefined,
    }));
    clearFieldError("file");
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
    if (!cloudinaryResult) {
      validationErrors.push({
        field: "file",
        message: "Please wait for the file to be uploaded to cloud storage.",
      });
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
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
    setIsUploadingToCloudinary(false);
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
              <div className="space-y-2">
                <Label>Upload Document *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    getFieldError("file")
                      ? "border-red-300 bg-red-50"
                      : selectedFile
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {!selectedFile ? (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm text-gray-600 mb-3">
                          Step 1: Select a file to upload
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <Label
                          htmlFor="file-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Label>

                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-2">
                            Supported file types:
                          </p>
                          <div className="flex flex-wrap justify-center gap-2 mb-3">
                            <Badge variant="destructive">PDF</Badge>
                            <Badge variant="default">DOC</Badge>
                            <Badge variant="default">DOCX</Badge>
                            <Badge variant="secondary">JPG</Badge>
                            <Badge variant="secondary">JPEG</Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            Maximum file size: 2MB
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />

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

                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(selectedFile.size)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={getFileTypeBadgeVariant(formData.fileType)}
                          >
                            {formData.fileType}
                          </Badge>
                          <Badge variant="outline" className="text-green-600">
                            ✓ Selected
                          </Badge>
                          {cloudinaryResult && (
                            <Badge
                              variant="outline"
                              className="text-purple-600"
                            >
                              ✓ Uploaded
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Upload Progress */}
                      {isUploadingToCloudinary && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-blue-700 font-medium">
                              Uploading to Cloud Storage...
                            </p>
                            <span className="text-sm text-blue-600 font-medium">
                              {uploadProgress}%
                            </span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-blue-600 mt-2">
                            Please wait while we upload your file securely
                          </p>
                        </div>
                      )}

                      {/* Manual Upload Button (fallback) */}
                      {!cloudinaryResult && !isUploadingToCloudinary && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-700 mb-2 font-medium">
                            Upload to Cloud Storage
                          </p>
                          <CloudinaryUpload
                            onUpload={handleCloudinaryUpload}
                            onError={handleCloudinaryError}
                            folder="documents"
                            resourceType="raw"
                            maxFileSize={MAX_FILE_SIZE}
                            disabled={isUploadingToCloudinary}
                            className="w-full"
                          >
                            Upload to Cloud Storage
                          </CloudinaryUpload>
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
                {getFieldError("file") && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription className="text-sm">
                      {getFieldError("file")}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
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
                isUploadingToCloudinary ||
                isSuccess ||
                !formData.title.trim() ||
                !formData.community ||
                !selectedFile ||
                !cloudinaryResult ||
                properties.length === 0
              }
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting
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
