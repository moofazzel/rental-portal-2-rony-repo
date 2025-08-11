"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageDropzoneProps {
  images: File[];
  setImages: (files: File[]) => void;
}

export default function ImageDropzone({
  images,
  setImages,
}: ImageDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImages([...images, ...acceptedFiles]);
    },
    [images, setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer text-center"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-sm text-gray-500">Drop the images here...</p>
      ) : (
        <p className="text-sm text-gray-500">
          Drag & drop images here, or click to select
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
