"use client";

import { createNotice, getAllProperties } from "@/app/apiClient/adminApi";
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
} from "@/types/notices.types";
import { noticeSchema } from "@/zod/notice.validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertTriangle,
  Building2,
  Calendar as CalendarIcon,
  Megaphone,
  Plus,
  Tag,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CreateNoticeModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State for date picker
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false); // control popover visibility
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setOpen(false); // close the calendar when a date is selected
  };

  const router = useRouter();

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

  const { data: properties, isLoading: isPropertiesLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: getAllProperties,
  });

  const handleClose = () => {
    setModalOpen(false);
    setSelectedDate(undefined);
    setErrors({});
  };

  //form validation before submitting
  const { mutateAsync: createNoticeMutation, isPending: isSubmitting } =
    useMutation({
      mutationFn: createNotice,
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
    const expiryDateRaw = formDataObj.get("expiryDate") as string;
    const propertyId = formDataObj.get("propertyId") as string;
    const sendNotification = formDataObj.get("sendNotification") !== null;

    // Convert expiryDate to Date
    const expiryDate = expiryDateRaw ? new Date(expiryDateRaw) : undefined;

    const payload: ICreateNotice = {
      title: title?.trim(),
      content: content?.trim(),
      type,
      priority,
      targetAudience,
      expiryDate,
      attachments: formData.attachments?.length ? formData.attachments : [],
      tags: formData.tags?.length ? formData.tags : [],
      sendNotification,
      propertyId: propertyId === "none" ? undefined : propertyId || undefined,
    };

    console.log(payload);
    // ✅ Validate with Zod
    const parsed = noticeSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: { [key: string]: string } = {};

      // Format each error as "Field: Message"
      const messages = parsed.error.errors.map((err) => `${err.message}`);

      // Show all errors joined with commas
      toast.error(messages.join(", "));

      // Set field-specific errors for the UI
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[String(err.path[0])] = err.message;
        }
      });
      console.log("all form error", parsed.error.format());

      setErrors(fieldErrors);
      return;
    }

    setErrors({}); // clear errors

    try {
      const res = await createNoticeMutation(payload);

      if (!res.success) {
        toast.error(res.message || "Something went wrong");
        return;
      }

      toast.success("Notice created successfully");
      setModalOpen(false);

      setFormData({
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

      router.refresh();
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create notice");
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData((prev: ICreateNotice) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev: ICreateNotice) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }));
  };
  // type FormFields =
  //   | "title"
  //   | "content"
  //   | "type"
  //   | "priority"
  //   | "targetAudience"
  //   | "expiryDate"
  //   | "propertyId"
  //   | "sendNotification"
  //   | "tags";

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >
  // ) => {
  //   const { name, value } = e.target as { name: FormFields; value: string };

  //   const updatedData = {
  //     ...formData,
  //     [name]: value,
  //   };

  //   setFormData(updatedData);

  //   const result = noticeSchema.safeParse(updatedData);

  //   if (!result.success) {
  //     const fieldErrors = result.error.formErrors.fieldErrors as Record<
  //       FormFields,
  //       string[]
  //     >;

  //     const fieldError = fieldErrors[name]?.[0];

  //     setErrors((prev) => ({
  //       ...prev,
  //       [name]: fieldError || "",
  //     }));
  //   } else {
  //     // Valid input: clear the error for this field
  //     setErrors((prev) => {
  //       const newErrors = { ...prev };
  //       delete newErrors[name];
  //       return newErrors;
  //     });

  //     setFormData({
  //       title: "",
  //       content: "",
  //       type: "GENERAL",
  //       priority: "MEDIUM",
  //       targetAudience: "ALL",
  //       expiryDate: undefined,
  //       propertyId: undefined,
  //       attachments: [],
  //       sendNotification: false,
  //       tags: [],
  //     });
  //   }
  // };
  // useEffect(() => {
  //   if (!modalOpen) {
  //     setFormData({
  //       title: "",
  //       content: "",
  //       type: "GENERAL",
  //       priority: "MEDIUM",
  //       targetAudience: "ALL",
  //       expiryDate: undefined,
  //       propertyId: "",
  //       attachments: [],
  //       sendNotification: false,
  //       tags: [],
  //     });

  //     setErrors({});
  //   }
  // }, [modalOpen]);

  return (
    <div>
      <Button
        onClick={() => setModalOpen(true)}
        size="lg"
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-[10px]"
      >
        <Plus className="h-4 w-4" />
        Create Notice
      </Button>

      <Dialog open={modalOpen} onOpenChange={handleClose}>
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
                Create New Notice
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1 min-h-0 px-6 py-6">
              <div className="space-y-6">
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
                        // onChange={handleChange}
                        defaultValue={formData.title}
                        className={
                          errors.title
                            ? "border-gray-300 ring-1 ring-red-500"
                            : "border-gray-300"
                        }
                        placeholder="Enter notice title..."
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600">{errors.title}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Content
                      </Label>
                      <Textarea
                        name="content"
                        // onChange={handleChange}
                        defaultValue={formData.content}
                        className={`min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                          errors.content
                            ? "border-gray-300 ring-1 ring-red-500"
                            : ""
                        }`}
                        placeholder="Enter notice content..."
                      />
                      {errors.content && (
                        <p className="text-sm text-red-600">{errors.content}</p>
                      )}
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
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.priority && (
                          <p className="text-sm text-red-600">
                            {errors.priority}
                          </p>
                        )}
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
                        {errors.type && (
                          <p className="text-sm text-red-600">{errors.type}</p>
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
                            <SelectItem value="PROPERTY_SPECIFIC">
                              Property Specific
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.targetAudience && (
                        <p className="text-sm text-red-600">
                          {errors.targetAudience}
                        </p>
                      )}

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Expiry Date
                        </Label>

                        {/* Custom Popover Calendar */}
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-transparent"
                            >
                              {selectedDate
                                ? format(selectedDate, "PPP")
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
                        {/* Optional: Hidden input to submit the selected date */}
                        <input
                          type="hidden"
                          // onChange={handleChange}
                          name="expiryDate"
                          value={selectedDate ? selectedDate.toISOString() : ""}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm">
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Property
                      </Label>
                      <Select
                        name="propertyId"
                        defaultValue={formData.propertyId}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                          <SelectValue
                            placeholder={
                              isPropertiesLoading
                                ? "Loading Properties..."
                                : "Select Property"
                            }
                          />
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
                      {errors.propertyId && (
                        <p className="text-sm text-red-600">
                          {" "}
                          {errors.propertyId}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="sendNotification"
                        id="sendNotification"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={formData.sendNotification}
                        onChange={(e) => {
                          console.log("Checkbox changed:", e.target.checked);
                          setFormData((prev) => ({
                            ...prev,
                            sendNotification: e.target.checked,
                          }));
                        }}
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
                      {errors.tags && (
                        <p className="text-sm text-red-600">{errors.tags}</p>
                      )}
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
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? "Submitting..." : "Create Notice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateNoticeModal;
