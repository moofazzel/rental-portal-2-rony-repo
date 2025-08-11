// src/app/services/(components)/RequestForm.tsx
"use client";

import { createTenantServiceRequest } from "@/app/apiClient/tenantApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    CreateServiceRequestDto,
    ServiceRequestPriority,
    ServiceRequestType,
} from "@/types/tenantServiceRequest.types";
import { AlertTriangle, Clock, Plus, Zap } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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

export default function RequestForm() {
  const router = useRouter();
  const pathname = usePathname();

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
      const res = await createTenantServiceRequest(dto);
      console.log("resssssssss", res);
      toast.success("Service request submitted successfully");

      router.push(`${pathname}?tab=history`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request");
      setSubmitted(false);
    }
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-6 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Plus className="w-10 h-10 p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white" />
          New Service Request
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Request Title */}
          <div>
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-gray-700 mb-3 block"
            >
              Request Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue (e.g., 'Leaky kitchen faucet')"
              required
              className="h-12 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* Service Type Selection */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-4 block">
              Service Type *
            </Label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICE_TYPES.map((service) => (
                <Button
                  key={service.name}
                  type="button"
                  variant={type === service.name ? "default" : "outline"}
                  className={`justify-start h-auto p-4 border-2 transition-all ${
                    type === service.name
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-500 shadow-lg"
                      : "hover:border-orange-300 hover:bg-orange-50"
                  }`}
                  onClick={() => setType(service.name)}
                >
                  <span className="text-2xl mr-3">{service.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{service.name}</div>
                    <div className="text-xs opacity-80 mt-1">
                      {service.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <Label
              htmlFor="report"
              className="text-sm font-semibold text-gray-700 mb-3 block"
            >
              Detailed Description *
            </Label>
            <Textarea
              id="report"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              rows={5}
              placeholder="Please describe the issue in detail. Include any relevant information such as when the problem started, specific locations, and any previous attempts to fix it..."
              required
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 resize-none"
            />
          </div>

          {/* Urgency Level - FIXED SECTION */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Urgency Level
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {URGENCY_OPTIONS.map((option) => {
                const isSelected = priority === option.value;
                const styles = URGENCY_STYLES[option.value];

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    className={`justify-start h-auto p-4 border-2 transition-all ${
                      isSelected ? styles.active : styles.inactive
                    }`}
                    onClick={() => setPriority(option.value)}
                  >
                    <span
                      className={`w-5 h-5 mr-3 ${
                        isSelected ? styles.iconActive : styles.iconInactive
                      }`}
                    >
                      {option.icon}
                    </span>
                    <div className="text-left">
                      <div className="font-semibold">{option.label}</div>
                      {/* <div className="text-xs opacity-80 mt-1">
                        {option.desc}
                      </div> */}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg text-white h-14 text-lg font-semibold"
            disabled={submitted}
          >
            {submitted ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Submitting Request...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-3" />
                Submit Service Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
