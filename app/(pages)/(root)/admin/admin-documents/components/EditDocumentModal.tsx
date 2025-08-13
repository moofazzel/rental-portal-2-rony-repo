"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IDocument } from "@/types/document.types";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

interface EditDocumentModalProps {
  document: IDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    documentId: string,
    updatedData: Partial<IDocument>
  ) => Promise<void>;
  properties: Array<{ id: string; name: string }>;
}

export function EditDocumentModal({
  document,
  isOpen,
  onClose,
  onSave,
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

  // Reset form when document changes
  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title,
        description: document.description || "",
        category: document.category || "GENERAL",
        propertyId: document.propertyId._id,
      });
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    setIsLoading(true);
    setError("");

    try {
      await onSave(document._id, {
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        propertyId: formData.propertyId,
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
    onClose();
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

          {/* Read-only file information */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                File Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">File Name:</span>
                <span className="font-medium">{document.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">File Type:</span>
                <span className="font-medium">{document.fileType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">File Size:</span>
                <span className="font-medium">
                  {document.fileSize
                    ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB`
                    : "Unknown"}
                </span>
              </div>
            </CardContent>
          </Card>

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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
