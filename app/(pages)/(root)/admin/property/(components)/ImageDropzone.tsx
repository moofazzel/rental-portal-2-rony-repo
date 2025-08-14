"use client";

import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";

interface ImageDropzoneProps {
  images: File[];
  setImages: (files: File[]) => void;
  disabled?: boolean;
}

export default function ImageDropzone({
  images,
  setImages,
  disabled = false,
}: ImageDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Notify about rejected files
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          const reason = errors.map((e) => e.message).join(", ");
          toast.error(
            `${file.name}: ${reason || "Unsupported file. Only JPG up to 2MB."}`
          );
        });
      }

      if (acceptedFiles.length > 0) {
        setImages([...images, ...acceptedFiles]);
      }
    },
    [images, setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"] },
    multiple: true,
    maxSize: 2 * 1024 * 1024, // 2MB
  });

  return (
    <div
      {...getRootProps()}
      aria-disabled={disabled}
      className={`w-full p-4 border-2 border-dashed border-gray-300 rounded-md text-center ${
        disabled ? "opacity-60 pointer-events-none" : "cursor-pointer"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-sm text-gray-500">Drop the images here...</p>
      ) : (
        <p className="text-sm text-gray-500">
          Drag & drop JPG images here (max 2MB), or click to select
        </p>
      )}

      <div className="flex gap-3 mt-4 flex-wrap justify-center">
        {images.map((file, i) => (
          <div key={i} className="w-24 h-24 overflow-hidden border rounded-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${i}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
