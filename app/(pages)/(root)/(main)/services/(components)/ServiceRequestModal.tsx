"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useState } from "react";
import RequestForm from "./RequestForm";

interface ServiceRequestModalProps {
  trigger?: React.ReactNode;
  className?: string;
}

export default function ServiceRequestModal({
  trigger,
  className,
}: ServiceRequestModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="lg"
            className={`bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 border-0 text-white hover:from-blue-700 hover:to-purple-700 ${className}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl min-w-fit w-[95vw] max-h-[95vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            Submit New Service Request
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(95vh-80px)]">
          <div className="p-6">
            <RequestForm onSuccess={handleSuccess} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
