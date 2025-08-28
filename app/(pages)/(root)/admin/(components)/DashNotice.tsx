import { getAllNotices } from "@/app/apiClient/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, Eye, Link } from "lucide-react";
import { Suspense } from "react";
import DashNoticeSkeleton from "./DashNoticeSkeleton";

async function DashNoticeData() {
  try {
    const noticesRes = await getAllNotices();
    const notices =
      noticesRes.success && noticesRes.data ? noticesRes.data : [];

    const getPriorityColor = (priority?: string) => {
      switch (priority) {
        case "HIGH":
          return "bg-red-50 text-red-700 border-red-200";
        case "MEDIUM":
          return "bg-amber-50 text-amber-700 border-amber-200";
        case "LOW":
          return "bg-emerald-50 text-emerald-700 border-emerald-200";
        default:
          return "bg-gray-50 text-gray-700 border-gray-200";
      }
    };

    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Bell className="h-5 w-5 text-amber-600" />
              </div>
              Notices
            </CardTitle>
            <Link href="/admin/notices">
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-600 hover:text-amber-700"
              >
                View All
                <Eye className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {notices.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="font-medium text-sm text-slate-900 line-clamp-1">
                    {notice.title}
                  </span>
                  <Badge
                    className={`${getPriorityColor(
                      notice.priority
                    )} border text-xs`}
                  >
                    {notice.priority}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                  {notice.content}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {notices.length === 0 && (
              <div className="p-6 text-center text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No notices found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching notices:", error);
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Bell className="h-5 w-5 text-amber-600" />
              </div>
              Notices
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-center text-slate-500">
          <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm">Error loading notices</p>
        </CardContent>
      </Card>
    );
  }
}

export default function DashNotice() {
  return (
    <Suspense fallback={<DashNoticeSkeleton />}>
      <DashNoticeData />
    </Suspense>
  );
}
