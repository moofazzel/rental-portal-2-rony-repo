import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import React from "react";

export default function AllPropertiesLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          </div>
          <p className="text-gray-600">
            Manage your rental properties and lots
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  {/* title placeholder */}
                  <Skeleton className="h-4 w-24" />
                  {/* value placeholder */}
                  <Skeleton className="h-8 w-16" />
                </div>
                {/* icon placeholder */}
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-white rounded-xl shadow-sm animate-pulse border border-gray-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
