"use client";

import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryUploadProps {
  onUpload: (result: any) => void;
  onError: (error: any) => void;
  folder?: string;
  resourceType?: "image" | "video" | "raw";
  maxFileSize?: number;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function CloudinaryUpload({
  onUpload,
  onError,
  folder = "documents",
  resourceType = "raw",
  maxFileSize = 2 * 1024 * 1024, // 2MB default
  className = "",
  disabled = false,
  children,
}: CloudinaryUploadProps) {
  return (
    <CldUploadWidget
      uploadPreset="rental-portal-documents"
      options={{
        maxFiles: 1,
        resourceType: resourceType,
        folder: folder,
        maxRawFileSize: maxFileSize, // Use maxRawFileSize for PDFs and other raw files
        sources: ["local"],
        showAdvancedOptions: false,
        cropping: false,
        multiple: false,
        defaultSource: "local",
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
          fonts: {
            default: null,
            "'Fira Sans', sans-serif": {
              url: "https://fonts.googleapis.com/css?family=Fira+Sans",
              active: true,
            },
          },
        },
      }}
      onUpload={onUpload}
      onError={onError}
    >
      {({ open }) => (
        <Button
          type="button"
          onClick={() => open()}
          disabled={disabled}
          className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white ${className}`}
        >
          <Cloud className="h-4 w-4 mr-2" />
          {children || "Upload to Cloudinary"}
        </Button>
      )}
    </CldUploadWidget>
  );
}
