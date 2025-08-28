import {
  getTenant,
  getTenantNotices,
  getTenantServiceRequests,
} from "@/app/apiClient/adminApi";
import { getTenantDocuments } from "@/app/apiClient/tenantApi";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { IDocument } from "@/types/document.types";
import { INotice } from "@/types/notices.types";
import { IServiceRequest } from "@/types/serviceRequest.types";
import Link from "next/link";
import AccountStatusBanner from "./(components)/AccountStatusBanner";
import DashboardStats from "./(components)/DashboardStats";
import RecentNotices from "./(components)/RecentNotices";
import ServiceRequests from "./(components)/ServiceRequests";
import { DocumentTable } from "./services/(components)/DocumentTable";

type GetAllServiceRequestsResponse = {
  serviceRequests: IServiceRequest[];
};

export default async function TenantDashboard() {
  const session = await auth();
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

  const documentsResponse = await getTenantDocuments(session?.user?._id || "");
  const documentLoadError =
    documentsResponse?.success === false
      ? documentsResponse.message || "Failed to load documents"
      : null;
  const documents: IDocument[] = Array.isArray(documentsResponse?.data)
    ? (documentsResponse.data as IDocument[])
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center py-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                Welcome back, {session?.user?.name?.split(" ")[0] || "Tenant"}!
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Here's what's happening with your rental today
              </p>
            </div>
            <div className="flex-1 flex sm:justify-end">
              <div className="text-left sm:text-right w-full sm:w-auto">
                <p className="text-xs sm:text-sm text-gray-500">Property</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base break-words max-w-full sm:max-w-xs truncate">
                  {tenantRes?.property?.name || "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-8">
        {/* Account Status Banner */}
        {tenantRes?.tenantStatus && (
          <div className="mb-8">
            <AccountStatusBanner
              tenantStatus={tenantRes.tenantStatus || false}
              tenantName={tenantRes.user.name}
            />
          </div>
        )}

        {/* Rent Status and Pay Section */}
        <div className="mb-8">
          <DashboardStats tenantRes={tenantRes} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">
          {/* Left Column - Notices */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-100 via-white to-indigo-100 rounded-xl shadow-lg border border-blue-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-blue-200/60 to-indigo-100/60">
                <h2 className="text-lg font-semibold text-blue-900 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 shadow"></div>
                  Community Notices
                </h2>
              </div>
              <RecentNotices notices={noticeResponse} />
            </div>
          </div>

          {/* Right Column - Service Requests and Documents */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Requests */}
            <div className="bg-gradient-to-br from-green-50 via-white to-green-100 rounded-xl shadow-lg border border-green-200 overflow-hidden">
              <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-green-200 bg-gradient-to-r from-green-200/60 to-white/60">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <h2 className="text-base sm:text-lg font-semibold text-green-900 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 shadow"></div>
                    Service Requests
                  </h2>
                  <div className="w-full sm:w-auto">
                    <Link href="/services" className="block w-full sm:w-auto">
                      <Button
                        size="sm"
                        className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow"
                      >
                        <span className="block sm:hidden">New</span>
                        <span className="hidden sm:block">New Request</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="px-2 sm:px-0">
                <ServiceRequests requests={serviceRequests} />
              </div>
            </div>

            {/* Documents */}
            <div className="bg-gradient-to-br from-purple-50 via-white to-pink-100 rounded-xl shadow-lg border border-purple-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-purple-200 bg-gradient-to-r from-purple-200/60 to-pink-100/60">
                <h2 className="text-lg font-semibold text-purple-900 flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 shadow"></div>
                  Community Documents
                </h2>
              </div>
              {documentLoadError && (
                <div className="px-6 py-4">
                  <div className="text-sm text-red-600">
                    {documentLoadError}
                  </div>
                </div>
              )}
              <DocumentTable documents={documents} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact the office at{" "}
              <span className="text-blue-700 font-semibold">
                (555) 555-0000
              </span>{" "}
              or visit the{" "}
              <Link
                href="/support"
                className="text-purple-600 hover:text-purple-700 font-medium underline"
              >
                Support page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
