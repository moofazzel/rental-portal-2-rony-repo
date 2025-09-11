import { getTenant } from "@/app/apiClient/adminApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

// Loading skeleton for the header
function TenantPageHeaderSkeleton() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center py-4">
          <div className="flex-1 min-w-0">
            <Skeleton className="h-7 sm:h-9 w-56 mb-3 bg-gray-200 animate-pulse" />
            <Skeleton className="h-5 sm:h-6 w-40 bg-gray-200 animate-pulse" />
          </div>
          <div className="flex-1 flex sm:justify-end">
            <div className="text-left sm:text-right w-full sm:w-auto">
              <Skeleton className="h-4 w-24 mb-2 bg-gray-200 animate-pulse" />
              <Skeleton className="h-5 w-32 bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function TenantPageHeaderContent() {
  const res = await getTenant();

  // Handle error cases
  if (!res.success || !res.data?.user) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center py-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                Tenant
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Property • Spot
              </p>
            </div>
            <div className="flex-1 flex sm:justify-end">
              <div className="text-left sm:text-right w-full sm:w-auto">
                <p className="text-xs sm:text-sm text-gray-500">Lease Status</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base break-words max-w-full sm:max-w-xs truncate">
                  Unknown Status
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tenantData = res.data.user;
  const propertyData = res.data.property;
  const spotData = res.data.spot;
  const leaseData = res.data.lease;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center py-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              {tenantData.name}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {propertyData?.name} • {spotData?.spotNumber}
            </p>
          </div>
          <div className="flex-1 flex sm:justify-end">
            <div className="text-left sm:text-right w-full sm:w-auto">
              <p className="text-xs sm:text-sm text-gray-500">Lease Status</p>
              <p className="font-medium text-gray-900 text-sm sm:text-base break-words max-w-full sm:max-w-xs truncate">
                {leaseData?.leaseStatus || "Unknown Status"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TenantPageHeader() {
  return (
    <Suspense fallback={<TenantPageHeaderSkeleton />}>
      <TenantPageHeaderContent />
    </Suspense>
  );
}
