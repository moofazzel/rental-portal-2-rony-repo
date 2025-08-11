"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INotice } from "@/types/notices.types";
import Link from "next/link";

interface RecentNoticesProps {
  notices: INotice[];
}

export default function RecentNotices({ notices }: RecentNoticesProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recent Notices
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {notices?.length > 0 ? (
          <>
            <div className="divide-y divide-slate-100">
              {notices.slice(0, 2).map((notice) => (
                <div
                  key={notice.id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="font-medium text-sm text-slate-900">
                      {notice.title}
                    </span>
                    {/* <Badge variant="secondary" className="text-xs">
                {notice.isRecent ? "Today" : notice.date}
              </Badge> */}
                  </div>
                  <p className="text-xs text-slate-600">{notice.content}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link href="/notices">
                <Button variant="outline" className="w-full text-sm">
                  View All Notices
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notices found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
