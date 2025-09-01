import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface AccountStatusBannerProps {
  tenantStatus: boolean;
  tenantName?: string;
}

export default function AccountStatusBanner({
  tenantStatus,
  tenantName,
}: AccountStatusBannerProps) {
  if (tenantStatus) {
    return null; // Don't show banner if status is true
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 shadow-sm mb-5">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-amber-900">
              Profile Under Review
            </h3>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              Admin Review
            </span>
          </div>
          <p className="text-xs text-amber-700 mb-3">
            Your profile is being reviewed by admin. You'll be notified when
            verified.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 text-xs h-7 px-3"
            >
              Contact Office
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
