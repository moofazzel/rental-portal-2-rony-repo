import { deleteServiceRequestById } from "@/app/apiClient/adminApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IServiceRequest } from "../types/service-request";

interface DeleteServiceRequestDialogProps {
  request: IServiceRequest;

  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteServiceRequestDialog({
  request,
  open,
  onOpenChange,
}: DeleteServiceRequestDialogProps) {
  const router = useRouter();

  const onDelete = async (request: { id: string; title: string }) => {
    try {
      const res = await deleteServiceRequestById({ requestId: request.id });
      console.log(res);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      onOpenChange(false);
      toast.success(`"${request.title}" has been removed`);
      router.refresh();

      // ✅ close dialog after deletion
    } catch (error) {
      console.error("Failed to delete request:", error);
      toast.error(`Failed to delete "${request.title}"`);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">
              “{request.title.slice(0, 30)}”
            </span>
            ? This action cannot be undone and will permanently remove this
            request.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete({ id: request._id!, title: request.title })}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
