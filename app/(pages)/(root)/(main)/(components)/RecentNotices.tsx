"use client";

import { Card, CardContent } from "@/components/ui/card";
import { INotice } from "@/types/notices.types";

interface RecentNoticesProps {
  notices: INotice[];
}

export default function RecentNotices({ notices }: RecentNoticesProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-0">
        {notices?.length > 0 ? (
          <>
            <div className="divide-y divide-slate-100">
              {notices.slice(0, 3).map((notice, index) => (
                <div
                  key={notice.id}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        {notice.title}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {notice.content}
                      </p>
                      {notice.createdAt && (
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* <div className="p-6 border-t border-slate-100">
              <Link href="/notices">
                <Button variant="outline" className="w-full text-sm">
                  View All Notices
                </Button>
              </Link>
            </div> */}
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 text-slate-400">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-500 font-semibold text-sm">
                    1
                  </span>
                </div>
                <div className="h-4 bg-slate-200 rounded w-48"></div>
              </div>
              <div className="flex items-center justify-center gap-3 text-slate-400">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-500 font-semibold text-sm">
                    2
                  </span>
                </div>
                <div className="h-4 bg-slate-200 rounded w-48"></div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">No notices available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
