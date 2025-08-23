"use client";

import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";

interface ImageModalProps {
  images: string[];
  propertyName?: string;
}

export default function ImageModal({ images, propertyName }: ImageModalProps) {
  return (
    <>
      {images.length > 0 && (
        <div className="w-[200px] h-[150px] relative group">
          <ImageZoom
            zoomMargin={40}
            backdropClassName="bg-black/90 backdrop-blur-sm"
          >
            <img
              src={images[0]}
              alt={propertyName || "Property image"}
              className="w-[200px] h-[150px] object-cover rounded-lg transition-all duration-300 group-hover:scale-105 cursor-zoom-in"
              onError={(e) => {
                console.error("Image failed to load:", images[0]);
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", images[0]);
              }}
            />
          </ImageZoom>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              Click to zoom
            </div>
          </div>

          {/* Image Counter Badge */}
          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
              +{images.length - 1} more
            </div>
          )}
        </div>
      )}
    </>
  );
}
