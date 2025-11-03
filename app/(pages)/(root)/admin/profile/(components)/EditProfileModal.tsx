"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserInfo } from "@/app/apiClient/adminApi";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface UserData {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  preferredLocation?: string;
}

interface EditProfileModalProps {
  user: UserData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  phoneNumber: string;
  bio?: string;
  preferredLocation?: string;
}

export default function EditProfileModal({
  user,
  isOpen,
  onOpenChange,
}: EditProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = user._id || user.id || session?.user?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
      preferredLocation: user.preferredLocation || "",
    },
  });

  const phoneNumber = watch("phoneNumber");

  const onSubmit = async (data: FormData) => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        ...(data.bio && { bio: data.bio }),
        ...(data.preferredLocation && { preferredLocation: data.preferredLocation }),
      };

      const response = await updateUserInfo({
        userId,
        data: updateData,
      });

      if (response.success) {
        toast.success("Profile updated successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <PhoneInput
                country={"us"}
                value={phoneNumber || ""}
                onChange={(value) => setValue("phoneNumber", value)}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  fontSize: "14px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  paddingLeft: "48px",
                }}
                containerStyle={{
                  width: "100%",
                }}
                buttonStyle={{
                  borderRadius: "6px 0 0 6px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredLocation">Preferred Location</Label>
              <Input
                id="preferredLocation"
                {...register("preferredLocation")}
                placeholder="Enter your preferred location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="Tell us about yourself"
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

