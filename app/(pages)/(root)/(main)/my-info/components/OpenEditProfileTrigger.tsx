"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Phone, User } from "lucide-react";

interface EmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
}

interface OpenEditProfileTriggerProps {
  emergencyContact?: EmergencyContact;
}

export function OpenEditProfileTrigger({
  emergencyContact,
}: OpenEditProfileTriggerProps) {
  const hasEmergencyContact =
    emergencyContact?.phone && emergencyContact.phone.trim() !== "";

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
        hasEmergencyContact
          ? "bg-green-50 border-green-200 hover:bg-green-100"
          : "bg-red-50 border-red-100 hover:bg-red-100"
      }`}
      onClick={() => window.dispatchEvent(new Event("openEditProfileModal"))}
    >
      {hasEmergencyContact ? (
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Phone className="w-5 h-5 text-green-600" />
        </div>
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}

      <div className="flex-1">
        <Label
          htmlFor="emergencyContact"
          className={`text-xs uppercase tracking-wider font-semibold ${
            hasEmergencyContact ? "text-green-700" : "text-red-600"
          }`}
        >
          Emergency Contact
        </Label>

        {hasEmergencyContact ? (
          <div className="mt-1 space-y-1">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-green-600" />
              <span className="text-sm font-medium text-gray-900">
                {emergencyContact.name || "Contact Name"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-green-600" />
              <span className="text-sm text-gray-700">
                {emergencyContact.phone}
              </span>
            </div>
            {emergencyContact.relationship && (
              <div className="text-xs text-gray-500">
                Relationship: {emergencyContact.relationship}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-1 space-y-1">
            <Input
              id="emergencyContact"
              readOnly
              placeholder="Who Should We Contact in an Emergency?"
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder:text-xs"
            />
            <p className="text-[9px] text-red-600 font-medium">
              ⚠️ We recommend adding an emergency contact for your safety
            </p>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500">
        Click to {hasEmergencyContact ? "edit" : "add"}
      </div>
    </div>
  );
}
