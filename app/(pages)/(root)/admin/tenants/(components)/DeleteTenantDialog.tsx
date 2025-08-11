"use client";

import { deleteUserById } from "@/app/apiClient/adminApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ITenant } from "@/types/tenant.types";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteTenantDialogProps {
  tenant: ITenant;
}

export default function DeleteTenantDialog({
  tenant,
}: DeleteTenantDialogProps) {
  const router = useRouter();

  const onDelete = async (tenant: { id: string; name: string }) => {
    try {
      const res = await deleteUserById({ userId: tenant.id });
      console.log("delete tenant respnose:", res);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(`${tenant.name} has been removed `);
      router.refresh();
      console.log("Tenant deleted:", tenant.id);

      // Refresh the page to update the tenants list
      router.refresh();
    } catch (error) {
      console.error("Failed to delete tenant:", error);
      toast.error(`Failed to delete ${tenant.name}`);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Delete tenant"
          className="text-red-600 hover:bg-red-500 hover:text-white border-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Confirm Tenant Removal
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to permanently remove{" "}
              <strong>{tenant?.name}</strong> from the system.
            </p>
            <p>This action will:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
              <li>Delete the tenant&apos;s account and profile</li>
              <li>Remove all property and lot assignments</li>
              <li>Cancel any active leases or agreements</li>
              <li>Delete all associated data and records</li>
            </ul>
            <p className="text-red-600 font-medium">
              This action cannot be undone. Please ensure you have backed up any
              important information.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete({ id: tenant._id!, name: tenant.name })}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Tenant
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
