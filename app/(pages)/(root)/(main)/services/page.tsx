// /services/page.tsx

import { getAllTenantServiceRequests } from "@/app/apiClient/tenantApi";
import { ApiResponse } from "@/types/api.types";
import { IServiceRequest } from "@/types/tenantServiceRequest.types";
import HelpSection from "../(components)/HelpSection";
import RequestForm from "./(components)/RequestForm";
import RequestHistory from "./(components)/RequestHistory";
import { SummaryCards } from "./(components)/SummeryCards";
import TabNav from "./(components)/TabNav";

export default async function ServicesRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  // const result = (await getAllTenantServiceRequests()) as ApiResponse<ListRes>;
  // const serviceRequests = (result.data?.data?.serviceRequests ||
  //   []) as IServiceRequest[];

  const result =
    (await getAllTenantServiceRequests()) as ApiResponse<IServiceRequest>;
  const serviceRequests = (result?.data?.serviceRequests ||
    []) as IServiceRequest[];

  // console.log("servicesssssssss", serviceRequests);

  // make “history” the fallback
  const activeTab = tab === "form" ? "form" : "history";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50  pb-8">
      <div className="container mx-auto p-6 space-y-8">
        {/* Summary at the top */}
        <SummaryCards requests={serviceRequests} />

        {/* Tab navigation */}
        <TabNav activeTab={activeTab} serviceCount={serviceRequests.length} />

        {/* Tab content */}
        {activeTab === "form" ? (
          <RequestForm />
        ) : (
          <RequestHistory requests={serviceRequests} />
        )}

        <HelpSection
          title="Need Immediate Assistance?"
          description="For urgent issues or emergency situations, contact the office directly"
          phone="(555) 555-0000"
          hours="Office Hours: 9 AM - 5 PM (Emergency: 24/7)"
        />
      </div>
      {/* Help section at bottom */}
    </div>
  );
}
