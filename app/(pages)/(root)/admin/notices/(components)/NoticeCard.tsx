"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnnouncementPriority, INotice } from "@/types/notices.types";
import { format } from "date-fns";
import { AlertTriangle, Calendar, Clock, Eye, Users } from "lucide-react";

type Props = {
  notice: INotice;
};

export function NoticeCard({ notice }: Props) {
  const previewText =
    notice.content?.split(" ").slice(0, 50).join(" ") +
    (notice.content?.split(" ").length > 50 ? "…" : "");

  const formattedDate = format(new Date(notice.createdAt), "MMM d, yyyy");
  const formattedExpiry = notice.expiryDate
    ? format(new Date(notice.expiryDate), "MMM d, yyyy")
    : null;

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = () => {
    if (notice.isExpired) return "bg-gray-100 text-gray-800 border-gray-200";
    if (notice.isActive) return "bg-green-100 text-green-800 border-green-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  const getStatusText = () => {
    if (notice.isExpired) return "Expired";
    if (notice.isActive) return "Active";
    return "Inactive";
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Main Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {notice.title}
                  </h3>
                  {notice.priority === ("HIGH" as AnnouncementPriority) && (
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={getPriorityColor(notice.priority)}
                  >
                    {notice.priority} Priority
                  </Badge>
                  <Badge variant="outline" className={getStatusColor()}>
                    {getStatusText()}
                  </Badge>
                  {notice.type && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {notice.type}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Content Preview */}
            <p className="text-gray-700 leading-relaxed text-sm line-clamp-2">
              {previewText}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Posted: {formattedDate}</span>
              </div>

              {formattedExpiry && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Expires: {formattedExpiry}</span>
                </div>
              )}

              {notice.targetAudience && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{notice.targetAudience}</span>
                </div>
              )}

              {notice.readCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{notice.readCount} reads</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {notice.tags && notice.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {notice.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-gray-50 text-gray-600"
                  >
                    #{tag}
                  </Badge>
                ))}
                {notice.tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-gray-50 text-gray-600"
                  >
                    +{notice.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {/* <div className="flex items-center gap-2 lg:flex-col lg:items-end">
            <UpdateNoticeModal notice={notice} onUpdate={() => {}} />
            <DeleteNoticeDialog notice={notice} />
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
