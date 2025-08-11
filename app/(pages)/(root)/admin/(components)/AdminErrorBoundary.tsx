"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface AdminErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export default function AdminErrorBoundary({
  error,
  reset,
}: AdminErrorBoundaryProps) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || "An error occurred while loading dashboard data"}
          </p>
          <Button onClick={reset} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
