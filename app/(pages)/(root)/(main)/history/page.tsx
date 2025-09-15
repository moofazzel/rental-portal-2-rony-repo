import { getPaymentsHistory } from "@/app/apiClient/tenantApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import TenantPageHeader from "../(components)/TenantPageHeader";
import HistoryClient from "./components/HistoryClinet";

// Loading component for Suspense
function HistoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Async component that fetches data
async function HistoryContent() {
  const paymentsResponse = await getPaymentsHistory();

  return <HistoryClient payments={paymentsResponse.data} />;
}

export default function HistoryPage() {
  return (
    <section>
      <Suspense fallback={<HistoryLoading />}>
        <TenantPageHeader />
        <HistoryContent />
      </Suspense>
    </section>
  );
}
