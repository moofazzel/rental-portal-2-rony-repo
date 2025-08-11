"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recent Service Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {requests.length > 0 ? (
          <>
            <div className="divide-y divide-slate-100">
              {requests.slice(0, 2).map((request) => (
                <div
                  key={request?._id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="font-medium text-sm text-slate-900">
                      {request?.title}
                    </span>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      Submitted :{" "}
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
                    {/* {request.resolvedDate && (
                  <div>Resolved: {request.resolvedDate}</div>
                )}
                {request.estimatedCompletion && (
                  <div>Estimated completion: {request.estimatedCompletion}</div>
                )} */}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link href="/services">
                <Button variant="outline" className="w-full text-sm">
                  View All Requests
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No service requests found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
