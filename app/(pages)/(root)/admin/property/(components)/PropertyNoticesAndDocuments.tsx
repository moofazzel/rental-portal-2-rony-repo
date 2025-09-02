"use client";

import { getAllDocuments, getAllNotices } from "@/app/apiClient/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "@/constants/RouteConstants";
import { INotice } from "@/types/notices.types";
import { IPropertyFull } from "@/types/properties.type";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface PropertyNoticesAndDocumentsProps {
  property: IPropertyFull;
}

export default function PropertyNoticesAndDocuments({
  property,
}: PropertyNoticesAndDocumentsProps) {
  const router = useRouter();

  // Fetch all notices and documents
  const { data: noticesResponse, isLoading: noticesLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: getAllNotices,
  });

  const { data: documentsResponse, isLoading: documentsLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: getAllDocuments,
  });

  // Filter notices and documents by property ID
  const propertyNotices = useMemo(() => {
    if (!noticesResponse?.data) return [];
    return noticesResponse.data.filter((notice) => {
      if (typeof notice.propertyId === "string") {
        return notice.propertyId === property._id;
      }
      if (notice.propertyId && typeof notice.propertyId === "object") {
        return notice.propertyId._id === property._id;
      }
      return false;
    });
  }, [noticesResponse?.data, property._id]);

  const propertyDocuments = useMemo(() => {
    if (!documentsResponse?.data) return [];
    return documentsResponse.data.filter((document) => {
      if (typeof document.propertyId === "string") {
        return document.propertyId === property._id;
      }
      if (document.propertyId && typeof document.propertyId === "object") {
        return document.propertyId._id === property._id;
      }
      return false;
    });
  }, [documentsResponse?.data, property._id]);

  const navigateToNotices = () => {
    router.push(Route.NoticesPath);
  };

  const navigateToDocuments = () => {
    router.push(Route.AdminDocumentsPath);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
      case "URGENT":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNoticeStatus = (notice: INotice) => {
    if (notice.isExpired) {
      return { status: "Expired", color: "text-red-600", icon: XCircle };
    }
    if (notice.isCurrentlyActive) {
      return { status: "Active", color: "text-green-600", icon: CheckCircle };
    }
    return { status: "Pending", color: "text-yellow-600", icon: Clock };
  };

  const getDocumentTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return "📄";
      case "DOC":
        return "📝";
      case "IMAGE":
        return "🖼️";
      case "VIDEO":
        return "🎥";
      default:
        return "📁";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (noticesLoading || documentsLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Notices Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Property Notices
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {propertyNotices.length} notice
                  {propertyNotices.length !== 1 ? "s" : ""} for {property.name}
                </p>
              </div>
            </div>
            <Button
              onClick={navigateToNotices}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {propertyNotices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No notices found for this property</p>
            </div>
          ) : (
            <div className="space-y-3">
              {propertyNotices.slice(0, 3).map((notice) => {
                const statusInfo = getNoticeStatus(notice);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={notice.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={navigateToNotices}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 text-sm truncate">
                            {notice.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs px-2 py-0.5 ${getPriorityColor(
                              notice.priority
                            )}`}
                          >
                            {notice.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {notice.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(notice.createdAt)}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${statusInfo.color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.status}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Property Documents
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {propertyDocuments.length} document
                  {propertyDocuments.length !== 1 ? "s" : ""} for{" "}
                  {property.name}
                </p>
              </div>
            </div>
            <Button
              onClick={navigateToDocuments}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {propertyDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No documents found for this property</p>
            </div>
          ) : (
            <div className="space-y-3">
              {propertyDocuments.slice(0, 3).map((document) => (
                <div
                  key={document._id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={navigateToDocuments}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {getDocumentTypeIcon(document.fileType)}
                        </span>
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {document.title}
                        </h4>
                        {document.category && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {document.category}
                          </Badge>
                        )}
                      </div>
                      {document.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {document.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(document.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {document.fileName}
                        </span>
                        {document.formattedFileSize && (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {document.formattedFileSize}
                          </span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
