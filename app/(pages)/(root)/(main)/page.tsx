import {
  getTenant,
  getTenantNotices,
  getTenantServiceRequests,
} from "@/app/apiClient/adminApi";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { INotice } from "@/types/notices.types";
import { IServiceRequest } from "@/types/serviceRequest.types";
import Link from "next/link";
import DashboardStats from "./(components)/DashboardStats";
import PaymentHistory from "./(components)/PaymentHistory";
import QuickActions from "./(components)/QuickActions";
import RecentNotices from "./(components)/RecentNotices";
import ServiceRequests from "./(components)/ServiceRequests";
import { DocumentTable } from "./services/(components)/DocumentTable";

type GetAllServiceRequestsResponse = {
  serviceRequests: IServiceRequest[];
};
export default async function TenantDashboard() {
  //fetch notices data

  const result = await getTenantNotices();

  const noticeResponse = result.data as INotice[];

  //fetch service requests data
  const serviceRequestsResult = await getTenantServiceRequests();

  let serviceRequests: IServiceRequest[] = [];

  if (
    serviceRequestsResult?.data &&
    "serviceRequests" in serviceRequestsResult.data
  ) {
    serviceRequests = (
      serviceRequestsResult.data as GetAllServiceRequestsResponse
    ).serviceRequests;
  } else {
    console.warn(
      "No serviceRequests found in API response:",
      serviceRequestsResult.data
    );
  }
  //fetch tenant data
  const tenantData = await getTenant();
  const tenantRes = tenantData?.data;

  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent flex items-center gap-3">
              Welcome Back!
              {session?.user?.name && (
                <span className="ml-3 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-lg font-semibold shadow-sm border border-blue-200">
                  {session.user.name}
                </span>
              )}
            </h1>
            <p className="text-slate-600 mt-2">
              Here&apos;s what&apos;s happening with your rental today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/pay-rent">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white cursor-pointer"
              >
                Pay Rent
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Request Service
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <DashboardStats tenantRes={tenantRes} />

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Notices */}
          <div className="lg:col-span-1 space-y-6">
            <QuickActions />
            <RecentNotices notices={noticeResponse} />
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ServiceRequests requests={serviceRequests} />
            <PaymentHistory payments={tenantRes?.payments?.recent || []} />
          </div>
        </section>

        {/* all document section */}

        <section>
          <DocumentTable />
        </section>

        {/* Footer */}
        <div className="text-center pt-10 text-sm text-slate-500">
          Need help? Contact the office at (555) 555-0000 or visit the
          <Link href="/support" className="text-blue-600 hover:underline">
            Support page
          </Link>
        </div>
      </div>
    </div>
  );
}
