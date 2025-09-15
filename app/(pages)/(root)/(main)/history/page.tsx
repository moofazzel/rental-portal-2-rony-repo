import { getPaymentsHistory } from "@/app/apiClient/tenantApi";
import { auth } from "@/auth";
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
  const session = await auth();
  console.log("🚀 ~ session:", session);
  console.log("🚀 ~ session.user:", session?.user);
  console.log("🚀 ~ session.user.token:", session?.user?.token);
  console.log("🚀 ~ session.user._id:", session?.user?._id);

  if (!session?.user?.id) {
    return <HistoryClient payments={null} error="User not authenticated" />;
  }

  if (!session?.user?.token) {
    return (
      <HistoryClient payments={null} error="Authentication token missing" />
    );
  }

  try {
    // @ts-expect-error: ignore type error for _id
    const paymentsResponse = await getPaymentsHistory(session.user._id);

    if (!paymentsResponse.success) {
      return (
        <HistoryClient
          payments={null}
          error={`API Error: ${paymentsResponse.message} (Status: ${paymentsResponse.statusCode})`}
        />
      );
    }

    return <HistoryClient payments={paymentsResponse.data} />;
  } catch (error) {
    console.error("Payment history fetch error:", error);
    return (
      <HistoryClient
        payments={null}
        error={`Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`}
      />
    );
  }
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
