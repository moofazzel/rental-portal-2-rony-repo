import { getTenant } from "@/app/apiClient/adminApi";
import { getUnreadAnnouncementsForTenant } from "@/app/apiClient/tenantApi";
import { NoticeTable } from "./components/NoticeTable";

const NoticePage = async () => {
  const allNotices = await getUnreadAnnouncementsForTenant();
  const tenantNotices = allNotices.data ?? [];

  // Fetch tenant data for header
  const tenantData = await getTenant();
  const tenantRes = tenantData?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 ">
        <div className="px-4 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center py-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                {tenantRes?.user?.name || "Tenant"}
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {tenantRes?.property?.name || "Property"} •{" "}
                {typeof tenantRes?.user?.spot === "object"
                  ? tenantRes?.user?.spot?.spotNumber
                  : "Spot"}
              </p>
            </div>
            <div className="flex-1 flex sm:justify-end">
              <div className="text-left sm:text-right w-full sm:w-auto">
                <p className="text-xs sm:text-sm text-gray-500">Lease Status</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base break-words max-w-full sm:max-w-xs truncate">
                  {tenantRes?.user?.lease?.leaseStatus || "Unknown Status"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center py-[120px] px-4">
        <div className="w-full max-w-[90%]">
          <NoticeTable notices={tenantNotices} />
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
