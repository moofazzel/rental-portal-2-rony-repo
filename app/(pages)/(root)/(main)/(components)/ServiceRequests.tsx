"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { IServiceRequest } from "@/types/serviceRequest.types";
import Link from "next/link";

interface ServiceRequestsProps {
  requests: IServiceRequest[];
}

export default function ServiceRequests({ requests }: ServiceRequestsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Resolved
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            In Progress
          </Badge>
        );
      case "submitted":
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800">
            Submitted
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800">
            {status}
          </Badge>
        );
    }
  };

  return (
    <CardContent className="p-0">
      {requests.length > 0 ? (
        <>
          <div className="divide-y divide-slate-100">
            {requests.slice(0, 3).map((request) => (
              <div
                key={request?._id}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {request?.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {request?.description || "No description provided"}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <div className="text-xs text-slate-500">
                  <div>
                    Submitted:{" "}
                    {request?.requestedDate
                      ? new Date(request.requestedDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-slate-100">
            <Link href="/services">
              <Button variant="outline" className="w-full text-sm">
                View All Requests
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="p-6 text-center">
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-500 font-semibold text-sm">1</span>
              </div>
              <div className="h-4 bg-slate-200 rounded w-48"></div>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-500 font-semibold text-sm">2</span>
              </div>
              <div className="h-4 bg-slate-200 rounded w-48"></div>
            </div>
          </div>
          <p className="text-sm text-slate-500">No service requests found</p>
        </div>
      )}
    </CardContent>
  );
}
