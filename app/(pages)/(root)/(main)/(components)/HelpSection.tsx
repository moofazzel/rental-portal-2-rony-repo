// src/components/HelpSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";
import React from "react";

export interface HelpSectionProps {
  /** Main heading text */
  title: string;
  /** Sub-text description */
  description: string;
  /** Primary phone number to display */
  phone: string;
  /** Hours or additional phone context */
  hours: string;
  /** Optional custom icon component */
  icon?: React.ReactNode;
  /** Additional wrapper className */
  className?: string;
}

export default function HelpSection({
  title,
  description,
  phone,
  hours,
  icon,
  className = "",
}: HelpSectionProps) {
  return (
    <Card
      className={`container mx-auto p-6 space-y-8 shadow-lg border-0 text-white ${className}`}
    >
      <CardContent className="p-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            {icon ?? <Phone className="w-4 h-4 text-gray-600" />}
          </div>
          <div>
            <h3 className="font-semibold text-md text-gray-500 ">{title}</h3>
            <p className="text-slate-500 text-sm">{description}</p>
            <div className="space-y-1">
              <p className="font-normal text-sm text-gray-600">{phone}</p>
              <p className="text-slate-600 text-sm font-light">{hours}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
