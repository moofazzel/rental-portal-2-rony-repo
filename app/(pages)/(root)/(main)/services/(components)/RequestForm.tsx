// src/app/services/(components)/RequestForm.tsx
"use client";

import { createTenantServiceRequest } from "@/app/apiClient/tenantApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateServiceRequestDto,
  ServiceRequestPriority,
  ServiceRequestType,
} from "@/types/tenantServiceRequest.types";
import { AlertTriangle, Clock, Plus, Zap } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";

const SERVICE_TYPES: Array<{
  name: ServiceRequestType;
  description: string;
  icon: React.ReactNode;
}> = [
  { name: "MAINTENANCE", description: "General repairs", icon: <Plus /> },
  { name: "UTILITY", description: "Plumbing, electric, etc.", icon: <Plus /> },
  { name: "SECURITY", description: "Locks and alarms", icon: <Plus /> },
  { name: "CLEANING", description: "Deep or routine cleaning", icon: <Plus /> },
  { name: "OTHER", description: "Miscellaneous requests", icon: <Plus /> },
];

const URGENCY_OPTIONS: Array<{
  value: ServiceRequestPriority;
  label: string;
  desc: string;
  icon: React.ReactNode;
}> = [
  {
    value: "LOW",
    label: "Low Priority",
    desc: "Can wait up to a week",
    icon: <Clock />,
  },
  {
    value: "MEDIUM",
    label: "Normal Priority",
    desc: "2–3 business days",
    icon: <AlertTriangle />,
  },
  {
    value: "HIGH",
    label: "High Priority",
    desc: "Urgent (24 hours)",
    icon: <Zap />,
  },
];

// Type-safe styling mapping object
const URGENCY_STYLES: Record<
  ServiceRequestPriority,
  {
    active: string;
    inactive: string;
    iconActive: string;
    iconInactive: string;
  }
> = {
  LOW: {
    active:
      "bg-yellow-500 hover:bg-yellow-400 text-white border-yellow-500 shadow-lg",
    inactive: "hover:border-yellow-300 hover:bg-yellow-100 text-gray-700",
    iconActive: "text-white",
    iconInactive: "text-yellow-500",
  },
  MEDIUM: {
    active:
      "bg-green-500 hover:bg-green-400 text-white border-green-500 shadow-lg",
    inactive: "hover:border-green-300 hover:bg-green-100 text-gray-700",
    iconActive: "text-white",
    iconInactive: "text-green-500",
  },
  HIGH: {
    active: "bg-red-500 hover:bg-red-400 text-white border-red-500 shadow-lg",
    inactive: "hover:border-red-300 hover:bg-red-100 text-gray-700",
    iconActive: "text-white",
    iconInactive: "text-red-500",
  },
  URGENT: {
    active: "bg-red-600 text-white border-red-600 shadow-lg",
    inactive: "hover:border-red-400 hover:bg-red-50 text-gray-700",
    iconActive: "text-white",
    iconInactive: "text-red-600",
  },
};

interface RequestFormProps {
  onSuccess?: () => void;
}

export default function RequestForm({ onSuccess }: RequestFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ServiceRequestType>("MAINTENANCE");
  const [report, setReport] = useState("");
  const [priority, setPriority] = useState<ServiceRequestPriority>("MEDIUM");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    const dto: CreateServiceRequestDto = {
      title,
      description: report,
      type,
      priority,
    };

    try {
      await createTenantServiceRequest(dto);
      toast.success("Service request submitted successfully");
      setSubmitted(false);

      // Call the success callback to close modal
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request");
      setSubmitted(false);
    }
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm w-full">
      <CardContent className="p-4 sm:p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 w-full">
          {/* Request Title */}
          <div className="w-full">
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3 block"
            >
              Request Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue (e.g., 'Leaky kitchen faucet')"
              required
              className="w-full h-12 text-base sm:text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* Service Type Selection */}
          <div className="w-full">
            <Label className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 block">
              Service Type *
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
              {SERVICE_TYPES.map((service) => (
                <Button
                  key={service.name}
                  type="button"
                  size="sm"
                  variant={type === service.name ? "default" : "outline"}
                  className={`justify-start h-auto p-3 sm:p-4 border-2 transition-all text-sm sm:text-base ${
                    type === service.name
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-500 shadow-lg"
                      : "hover:border-orange-300 hover:bg-orange-50"
                  }`}
                  onClick={() => setType(service.name)}
                >
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3">
                    {service.icon}
                  </span>
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-semibold truncate">{service.name}</div>
                    <div className="text-xs opacity-80 mt-1 hidden sm:block">
                      {service.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Detailed Description */}
          <div className="w-full">
            <Label
              htmlFor="report"
              className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3 block"
            >
              Detailed Description *
            </Label>
            <Textarea
              id="report"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              rows={4}
              placeholder="Please describe the issue in detail. Include any relevant information such as when the problem started, specific locations, and any previous attempts to fix it..."
              required
              className="w-full min-w-0 border-gray-300 focus:border-orange-500 focus:ring-orange-500 resize-none text-sm sm:text-base"
            />
          </div>

          {/* Urgency Level */}
          <div className="w-full">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Urgency Level
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
              {URGENCY_OPTIONS.map((option) => {
                const isSelected = priority === option.value;
                const styles = URGENCY_STYLES[option.value];

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    className={`justify-start h-auto p-3 sm:p-4 border-2 transition-all text-sm sm:text-base ${
                      isSelected ? styles.active : styles.inactive
                    }`}
                    onClick={() => setPriority(option.value)}
                  >
                    <span
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 ${
                        isSelected ? styles.iconActive : styles.iconInactive
                      }`}
                    >
                      {option.icon}
                    </span>
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-semibold truncate">
                        {option.label}
                      </div>
                      <div className="text-xs opacity-80 mt-1 hidden sm:block">
                        {option.desc}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg text-white h-12 sm:h-14 text-base sm:text-lg font-semibold"
            disabled={submitted}
          >
            {submitted ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-3" />
                <span className="hidden sm:inline">Submitting Request...</span>
                <span className="sm:hidden">Submitting...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                <span className="hidden sm:inline">Submit Service Request</span>
                <span className="sm:hidden">Submit Request</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
