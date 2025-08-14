import { getUnreadAnnouncementsForTenant } from "@/app/apiClient/tenantApi";
import { NoticeTable } from "./components/NoticeTable";

const NoticePage = async () => {
  const allNotices = await getUnreadAnnouncementsForTenant();
  const tenantNotices = allNotices.data ?? [];
  return (
    <div className="flex justify-center items-center py-[120px] px-4">
      <div className="w-full max-w-[90%]">
        <NoticeTable notices={tenantNotices} />
      </div>
    </div>
  );
};

export default NoticePage;
