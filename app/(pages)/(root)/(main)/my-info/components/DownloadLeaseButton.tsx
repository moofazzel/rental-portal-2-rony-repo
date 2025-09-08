"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface DownloadLeaseButtonProps {
  leaseAgreement?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function DownloadLeaseButton({
  leaseAgreement,
  variant = "default",
  size = "sm",
  className = "",
  showIcon = true,
  children = "Download",
}: DownloadLeaseButtonProps) {
  const handleDownload = () => {
    if (!leaseAgreement) return;

    // Handle Cloudinary URLs with download attachment
    const isCloudinary =
      leaseAgreement.includes("res.cloudinary.com") &&
      leaseAgreement.includes("/upload/");

    if (isCloudinary) {
      // Add fl_attachment for download
      const downloadUrl = leaseAgreement.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
      window.open(downloadUrl, "_blank");
    } else {
      // Fallback for other URLs
      window.open(leaseAgreement, "_blank");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownload}
      disabled={!leaseAgreement}
    >
      {showIcon && <Download className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
}

interface LeaseAgreementSectionProps {
  leaseAgreement?: string;
}

export function LeaseAgreementSection({
  leaseAgreement,
}: LeaseAgreementSectionProps) {
  if (!leaseAgreement) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
        <FileText className="w-6 h-6 text-green-600" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">
          Lease Agreement
        </p>
        <p className="font-semibold text-gray-900">
          Download your signed lease document
        </p>
      </div>
      <DownloadLeaseButton
        leaseAgreement={leaseAgreement}
        className="bg-green-600 hover:bg-green-700 text-white"
      />
    </div>
  );
}
