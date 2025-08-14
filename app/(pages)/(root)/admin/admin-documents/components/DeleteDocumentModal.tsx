"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IDocument } from "@/types/document.types";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteDocumentModalProps {
  document: IDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (documentId: string) => Promise<void>;
}

export function DeleteDocumentModal({
  document,
  isOpen,
  onClose,
  onConfirm,
}: DeleteDocumentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!document) return;

    setIsLoading(true);
    setError("");

    try {
      await onConfirm(document._id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete document"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setIsLoading(false);
    onClose();
  };

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Delete Document
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this document? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="font-medium text-gray-900">{document.title}</div>
              {document.description && (
                <div className="text-sm text-gray-600">
                  {document.description}
                </div>
              )}
              <div className="text-xs text-gray-500">
                File: {document.fileName} ({document.fileType})
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Warning:</p>
              <p>
                This will permanently delete the document and remove it from all
                properties.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Document"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
