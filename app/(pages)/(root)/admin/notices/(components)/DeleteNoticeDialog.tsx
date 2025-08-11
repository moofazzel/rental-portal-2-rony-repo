import { deleteNoticeById } from "@/app/apiClient/adminApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { INotice } from "@/types/notices.types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteNoticeDialogProps {
  notice: INotice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteNoticeDialog({
  notice,
  open,
  onOpenChange,
}: DeleteNoticeDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const onDelete = async (notice: { id: string; title: string }) => {
    try {
      setIsDeleting(true);
      const res = await deleteNoticeById({ noticeId: notice.id });

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      onOpenChange(false); // ✅ close dialog after deletion
      toast.success(`"${notice.title}" has been removed`);

      router.refresh();
    } catch (error) {
      console.error("Failed to delete Notice:", error);
      toast.error(`Failed to delete "${notice.title}"`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogDescription className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">
              “{notice.title.slice(0, 30)}”
            </span>
            ? This action cannot be undone and will permanently remove this
            notice from your system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete({ id: notice.id!, title: notice.title })}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete Notice"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
