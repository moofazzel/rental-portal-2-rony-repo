import { getAllNotices } from "@/app/apiClient/adminApi";
import { INotice } from "@/types/notices.types";
import { Suspense } from "react";
import NoticesPage from "./(components)/NoticesPage";
import NoticesPageSkeleton from "./(components)/NoticesPageSkeleton";

// Force dynamic rendering to prevent build errors with auth
export const dynamic = "force-dynamic";

async function NoticesContent() {
  const result = await getAllNotices();
  const noticeResponse = result.data as INotice[];
  return <NoticesPage notices={noticeResponse} />;
}

export default function Notices() {
  return (
    <Suspense fallback={<NoticesPageSkeleton />}>
      <NoticesContent />
    </Suspense>
  );
}
