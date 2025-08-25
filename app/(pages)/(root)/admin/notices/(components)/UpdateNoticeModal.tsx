"use client";

import { getAllProperties, updateNoticeById } from "@/app/apiClient/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AnnouncementPriority,
  AnnouncementTargetAudience,
  AnnouncementType,
  ICreateNotice,
  INotice,
} from "@/types/notices.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertTriangle,
  Building2,
  Calendar as CalendarIcon,
  Megaphone,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeleteNoticeDialog } from "./DeleteNoticeDialog";
interface UpdateNoticeModalProps {
  notice: INotice;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  onUpdate: (updatedNotice: ICreateNotice) => void;
}

const UpdateNoticeModal = ({
  notice,
  modalOpen,
  setModalOpen,
  onUpdate,
}: UpdateNoticeModalProps) => {
  // const [modalOpen, setModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ICreateNotice, string>>
  >({});
  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: getAllProperties,
  });
  const [formData, setFormData] = useState<ICreateNotice>({
    title: "",
    content: "",
    type: "GENERAL",
    priority: "MEDIUM",
    targetAudience: "ALL",
    expiryDate: undefined,
    propertyId: undefined,
    attachments: [],
    sendNotification: false,
    tags: [],
  });
  // date state

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.expiryDate ? new Date(formData.expiryDate) : undefined
  );
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // setFormData((prev) => ({
      //   ...prev,
      //   expiryDate: date.toISOString(), // You can also format here if needed
      // }));
      setOpen(false); // Close calendar on select
    }
  };

  useEffect(() => {
    if (modalOpen && notice) {
      setFormData({
        title: notice.title || "",
        content: notice.content || "",
        type: notice.type || "GENERAL",
        priority: notice.priority || "MEDIUM",
        targetAudience: notice.targetAudience || "ALL",
        expiryDate: notice.expiryDate ? new Date(notice.expiryDate) : undefined,
        attachments: notice.attachments || [],
        sendNotification: notice.sendNotification || false,
        tags: notice.tags || [],
        propertyId:
          typeof notice.propertyId === "object"
            ? notice.propertyId._id
            : notice.propertyId,
      });
    }
  }, [modalOpen, notice]);

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  //validate form before submitting
  const { mutateAsync: updateNoticeMutation, isPending: isSubmitting } =
    useMutation({
      mutationFn: updateNoticeById,
    });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formDataObj = new FormData(form);

    const title = formDataObj.get("title") as string;
    const content = formDataObj.get("content") as string;
    const type = formDataObj.get("type") as AnnouncementType;
    const priority = formDataObj.get("priority") as AnnouncementPriority;
    const targetAudience = formDataObj.get(
      "targetAudience"
    ) as AnnouncementTargetAudience;
    const expiryDate = formDataObj.get("expiryDate") as string;
    const propertyId = formDataObj.get("propertyId") as string;
    const sendNotification = formDataObj.get("sendNotification") !== null;

    const errors: Partial<Record<keyof ICreateNotice, string>> = {};

    if (!title.trim()) errors.title = "Title is required";
    if (!content.trim()) errors.content = "Content is required";
    if (!type) errors.type = "Type is required";
    if (!priority) errors.priority = "Priority is required";
    if (!targetAudience) errors.targetAudience = "Target audience is required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const payload = {
      noticeId: notice.id,
      data: {
        title: title.trim(),
        content: content.trim(),
        type,
        priority,
        targetAudience,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        attachments: formData.attachments?.length ? formData.attachments : [],
        tags: formData.tags?.length ? formData.tags : [],
        sendNotification,
        propertyId: propertyId === "none" ? undefined : propertyId || undefined,
      },
    };
    console.log(payload);
    try {
      const res = await updateNoticeMutation(payload);
      console.log("🚀 ~ res:", res);

      if (!res.success) {
        toast.error(res.message || "Update failed");

        //
        setFormErrors({ title: res.message || "Update failed" });
        return;
      }

      setModalOpen(false);
      toast.success("Notice updated successfully ");

      onUpdate(payload.data);
      router.refresh();
    } catch (err) {
      console.error(err);
      setFormErrors({ title: "Update failed" });
    }
  };
  console.log(formErrors);
  return (
    <>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl w-full h-[85vh] p-0 overflow-hidden">
          <form
            className="flex h-full min-h-0 flex-col"
            onSubmit={handleSubmit}
          >
            <DialogHeader className="sticky top-0 z-10 px-6 py-4 border-b bg-background">
              <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Megaphone className="h-5 w-5 text-blue-600" />
                </div>
                Update Notice
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1 min-h-0 px-6 py-6">
              <div className="space-y-6">
                {/* Scrollable Content */}
                {/* Basic Info */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                      <div className="p-1.5 bg-blue-200 rounded-md">
                        <Megaphone className="h-4 w-4 text-blue-700" />
                      </div>
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Title
                      </Label>
                      <Input
                        name="title"
                        defaultValue={formData.title}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter notice title..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Content
                      </Label>
                      <Textarea
                        name="content"
                        defaultValue={formData.content}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                        placeholder="Enter notice content..."
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Settings */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                      <div className="p-1.5 bg-orange-200 rounded-md">
                        <AlertTriangle className="h-4 w-4 text-orange-700" />
                      </div>
                      Notice Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Priority
                        </Label>
                        <Select
                          name="priority"
                          defaultValue={formData.priority}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Type
                        </Label>
                        <Select name="type" defaultValue={formData.type}>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GENERAL">General</SelectItem>
                            <SelectItem value="MAINTENANCE">
                              Maintenance
                            </SelectItem>
                            <SelectItem value="EVENT">Event</SelectItem>
                            <SelectItem value="SECURITY">Security</SelectItem>
                            <SelectItem value="BILLING">Billing</SelectItem>
                            <SelectItem value="EMERGENCY">Emergency</SelectItem>
                            <SelectItem value="RULE_UPDATE">
                              Rule Update
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.type && (
                          <p className="text-sm text-red-600">
                            {formErrors.type}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Target Audience
                        </Label>
                        <Select
                          name="targetAudience"
                          defaultValue={formData.targetAudience}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">All</SelectItem>
                            <SelectItem value="TENANTS_ONLY">
                              Tenants Only
                            </SelectItem>
                            <SelectItem value="ADMINS_ONLY">
                              Admins Only
                            </SelectItem>
                            <SelectItem value="COMMUNITY_SPECIFIC">
                              Community Specific
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          Expiry Date
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-transparent"
                            >
                              {selectedDate
                                ? format(selectedDate, "PPP")
                                : formData.expiryDate
                                ? format(new Date(formData.expiryDate), "PPP")
                                : "Select a date"}
                              <CalendarIcon className="h-4 w-4 text-gray-500 ml-2" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 mt-2">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={handleDateSelect}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <input
                          type="hidden"
                          name="expiryDate"
                          value={
                            selectedDate
                              ? format(selectedDate, "yyyy-MM-dd")
                              : ""
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Community
                      </Label>
                      <Select
                        name="propertyId"
                        defaultValue={formData.propertyId || "none"}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                          <SelectValue placeholder="Select Community" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            No Community Selected
                          </SelectItem>
                          {properties?.data
                            ?.filter(
                              (prop) => prop._id && prop._id.trim() !== ""
                            )
                            .map((prop) => (
                              <SelectItem key={prop._id!} value={prop._id!}>
                                {prop.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="sendNotification"
                        id="sendNotification"
                        defaultChecked={formData.sendNotification}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label
                        htmlFor="sendNotification"
                        className="text-sm font-medium text-gray-700"
                      >
                        Send notification to users
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                      <div className="p-1.5 bg-purple-200 rounded-md">
                        <Tag className="h-4 w-4 text-purple-700" />
                      </div>
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Add Tags
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Enter tag and press Enter..."
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          onKeyDown={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="outline"
                          className="border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge
                            key={`tag-${tag}-${index}`}
                            variant="outline"
                            className="bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200 transition-colors"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-purple-500 hover:text-purple-700 font-bold"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            <DialogFooter className="sticky bottom-0 z-10 gap-3 px-6 py-4 border-t bg-background sm:flex-row sm:justify-between">
              {/* Left: Delete Button */}
              <button
                type="button"
                className="cursor-pointer bg-transparent hover:bg-red-50 p-4 rounded-lg transition-colors"
                aria-label="Delete notice"
                onClick={() => {
                  setModalOpen(false);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="w-[22px] h-[22px] text-red-500" />
              </button>

              {/* Right: Cancel and Update */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? "Updating" : "Update Notice"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteNoticeDialog
        notice={notice}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
};

export default UpdateNoticeModal;
