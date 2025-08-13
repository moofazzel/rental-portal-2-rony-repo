"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, X } from "lucide-react";
import { CldImage } from "next-cloudinary";

interface ImagePreviewModalProps {
  selectedImage: {
    url: string;
    title: string;
    fileName: string;
  } | null;
  onClose: () => void;
}

export function ImagePreviewModal({
  selectedImage,
  onClose,
}: ImagePreviewModalProps) {
  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-semibold">{selectedImage.title}</div>
                <div className="text-sm text-gray-500 font-normal">
                  {selectedImage.fileName}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-6 flex items-center justify-center bg-gray-50">
          <div className="max-w-full max-h-full">
            <CldImage
              src={selectedImage.url}
              alt={selectedImage.title}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              crop="scale"
              gravity="auto"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
