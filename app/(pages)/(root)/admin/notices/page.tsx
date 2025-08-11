import { getAllNotices } from "@/app/apiClient/adminApi";
import { INotice } from "@/types/notices.types";
import NoticesPage from "./(components)/NoticesPage";

export default async function page() {
  const result = await getAllNotices();

  const noticeResponse = result.data as INotice[];

  return <NoticesPage notices={noticeResponse} />;
}
