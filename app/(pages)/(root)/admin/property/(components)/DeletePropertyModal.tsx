"use client";

import { deleteProperty } from "@/app/apiClient/adminApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IPropertyFull } from "@/types/properties.type";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeletePropertyModal({
  property,
}: {
  property: IPropertyFull;
}) {
  console.log("🚀 ~ property: fff", property);
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!property?._id) {
      toast.error("Property ID is required");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteProperty(property._id);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Property deleted successfully");
      router.push("/admin/property");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete property";
      toast.error(errorMessage);
      console.error("Delete property error:", error);
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-red-500 hover:bg-red-600 hover:border-red-500 text-white"
          variant="outline"
          size="icon"
          title="Delete Property"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Property</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the property &quot;
            {property?.name}&quot;? This action cannot be undone.
            <br />
            <br />
            <strong>This will also:</strong>
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Remove all associated tenants</li>
              <li>Delete all service requests</li>
              <li>Remove all lots and spots</li>
              <li>Cancel any active leases</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete Property"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
