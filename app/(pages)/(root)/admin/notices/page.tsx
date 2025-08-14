import { getAllNotices } from "@/app/apiClient/adminApi";
import { INotice } from "@/types/notices.types";
import NoticesPage from "./(components)/NoticesPage";

// Force dynamic rendering to prevent build errors with auth
export const dynamic = "force-dynamic";

export default async function Notices() {
  const result = await getAllNotices();

  const noticeResponse = result.data as INotice[];

  return <NoticesPage notices={noticeResponse} />;
}
