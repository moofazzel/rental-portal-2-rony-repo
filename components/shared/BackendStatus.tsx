"use client";

import { checkBackendStatus } from "@/lib/backendStatus";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export function BackendStatus() {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(
    null
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      const available = await checkBackendStatus();
      console.log("🚀 ~ available:", available);
      setIsBackendAvailable(available);
      setIsChecking(false);
    };

    checkStatus();

    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Don't show anything if checking or if backend is available
  if (isChecking || isBackendAvailable === true) {
    return null;
  }

  // Show warning when backend is unavailable
  if (isBackendAvailable === false) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Backend Unavailable
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                The server is not responding. Some features may not work
                properly.
              </p>
              <div className="mt-2 text-xs text-yellow-600">
                <p>• API requests will fail</p>
                <p>• Data may not be saved</p>
                <p>• Check your connection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
