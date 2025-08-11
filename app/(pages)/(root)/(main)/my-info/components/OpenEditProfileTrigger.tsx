"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function OpenEditProfileTrigger() {
  return (
    <div
      className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100 cursor-pointer hover:bg-red-100"
      onClick={() => window.dispatchEvent(new Event("openEditProfileModal"))}
    >
      <AlertCircle className="w-5 h-5 text-red-500" />
      <div className="flex-1">
        <Label
          htmlFor="emergencyContact"
          className="text-xs text-red-600 uppercase tracking-wider font-semibold"
        >
          Emergency Contact
        </Label>
        <Input
          id="emergencyContact"
          readOnly
          placeholder="Who Should We Contact in an Emergency?"
          className="mt-1 w-full bg-transparent border-none focus:ring-0 text-gray-900"
        />
      </div>
    </div>
  );
}
