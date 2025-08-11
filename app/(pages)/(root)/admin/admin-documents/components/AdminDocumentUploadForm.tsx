"use client";

import { handleUpload, UploadFormState } from "@/app/actions/upload";
import { getAllProperties } from "@/app/apiClient/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";

import { CloudUpload, FileText } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { toast } from "sonner";

const initialState: UploadFormState = {
  success: false,
  errors: {},
};

interface FilePreview {
  file: File;
  preview: string | null;
  progress: number;
  status: "pending" | "uploading" | "done";
}

export default function UploadForm() {
  const [state, formAction, isPending] = useActionState(
    handleUpload,
    initialState
  );
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: getAllProperties,
  });

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const MAX_SIZE_MB = 10;
    const MAX_IMAGE_WIDTH = 1000;
    const MAX_IMAGE_HEIGHT = 1000;

    const previews: FilePreview[] = [];

    Array.from(files).forEach((file) => {
      const fileSizeMB = file.size / (1024 * 1024);
      const isImage = file.type.startsWith("image/");

      if (fileSizeMB > MAX_SIZE_MB) {
        toast.error(`${file.name} exceeds the 10MB size limit.`);
        return;
      }

      if (isImage) {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          if (img.width > MAX_IMAGE_WIDTH || img.height > MAX_IMAGE_HEIGHT) {
            toast.error(
              `${file.name} exceeds ${MAX_IMAGE_WIDTH}×${MAX_IMAGE_HEIGHT} pixel dimensions.`
            );
          } else {
            previews.push({
              file,
              preview: url,
              progress: 0,
              status: "pending",
            });
            setFilePreviews([...previews]);
          }
        };
        img.src = url;
      } else {
        previews.push({
          file,
          preview: null,
          progress: 0,
          status: "pending",
        });
        setFilePreviews([...previews]);
      }
    });
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        Array.from(files).forEach((file) => dt.items.add(file));
        fileInputRef.current.files = dt.files;
      }
      handleFileChange(files);
    }
  };

  return (
    <form
      action={formAction}
      className="mx-auto mt-10 p-6  rounded-lg  bg-white space-y-5"
      encType="multipart/form-data"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Enter title..." />
        {state.errors?.title && (
          <p className="text-sm text-red-500">{state.errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Write a brief description..."
        />
        {state.errors?.description && (
          <p className="text-sm text-red-500">{state.errors.description}</p>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        {/* Community Dropdown */}
        <div className="flex-1 space-y-1">
          <Label htmlFor="community">Community</Label>
          <Select name="community">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Community" />
            </SelectTrigger>
            <SelectContent>
              {properties?.data?.map((prop) => (
                <SelectItem key={prop.id || ""} value={prop.id || ""}>
                  {prop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.community && (
            <p className="text-sm text-red-500">{state.errors.community}</p>
          )}
        </div>

        {/* File Type Dropdown */}
        <div className="flex-1 space-y-1">
          <Label htmlFor="fileType">File Type</Label>
          <Select name="fileType">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="img">Image</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">DOC</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.fileType && (
            <p className="text-sm text-red-500">{state.errors.fileType}</p>
          )}
        </div>
      </div>

      {filePreviews.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div>
            {item.preview ? (
              <img
                src={item.preview}
                alt="preview"
                className="w-10 h-10 rounded object-cover"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium truncate">{item.file.name}</p>
            <div className="h-1 w-full bg-gray-200 rounded">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${item.progress || 66.66}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}

      <div
        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors ${
          dragActive ? "border-blue-600 bg-blue-100" : "border-blue-300"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          name="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        />
        <div className="text-center flex items-center justify-center">
          <CloudUpload className="w-12 h-12 text-blue-500 mb-2" />
        </div>
        <div className="text-blue-600 font-medium">Drag and drop here</div>
        <div className="text-sm text-gray-600">
          or <span className="text-blue-700 underline">browse</span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full text-base font-semibold bg-blue-600 hover:bg-blue-700"
        disabled={isPending}
      >
        {isPending ? "Uploading..." : "Upload"}
      </Button>

      {state.success && (
        <p className="text-green-600 text-center">Upload successful!</p>
      )}
    </form>
  );
}
