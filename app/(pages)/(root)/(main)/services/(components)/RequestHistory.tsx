"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IServiceRequest } from "@/types/tenantServiceRequest.types";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

/** replicate your service‐icon map from page.tsx */
const services = [
  { name: "Water", icon: "🚿", color: "green" },
  { name: "Electrical", icon: "⚡", color: "blue" },
  { name: "HVAC", icon: "❄️", color: "cyan" },
  { name: "Pest Control", icon: "🐛", color: "yellow" },
  { name: "General Maintenance", icon: "🔧", color: "purple" },
  { name: "Other", icon: "📝", color: "gray" },
];

interface RequestHistoryProps {
  requests: IServiceRequest[];
}

export function RequestHistory({ requests }: RequestHistoryProps) {
  const [search, setSearch] = useState("");

  const filteredRequests = requests.filter((r) =>
    [r.title, r.type, r.status].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const getServiceIcon = (serviceName: string) => {
    const svc = services.find((s) => s.name === serviceName);
    return svc?.icon || "🔧";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Submitted
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            In Progress
          </Badge>
        );
      case "Completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            High Priority
          </Badge>
        );
      case "normal":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Normal
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Low Priority
          </Badge>
        );
      default:
        return <Badge variant="secondary">{urgency}</Badge>;
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-3">
            Request History
          </CardTitle>
          <div className="relative max-w-md pt-4">
            <Search className="absolute w-4 h-4 mt-3 ml-3 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search by title, type, or status…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className=" space-y-4">
        {/* Search bar */}

        {/* No results */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 text-red-500">
            No service requests found.
          </div>
        ) : (
          /* List out each request */
          filteredRequests.map((request) => {
            const svc = services.find((s) => s.name === request.type);
            const color = svc?.color ?? "gray";

            return (
              <Card
                key={request._id}
                className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-gradient-to-br from-${color}-50 to-white hover:from-${color}-100 hover:to-${color}-50 `}
              >
                <CardContent className="p-6 flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Status indicator bar */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${color}-500 to-${color}-600`}
                  />

                  {/* Left Column - Image */}
                  <div className="flex-shrink-0 w-full md:w-2/5">
                    <div className="h-32 md:h-40 bg-gray-100 rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={
                          request.images && request.images.length > 0
                            ? request.images[0]
                            : "/no-image.png"
                        }
                        alt={request.title}
                        width={330}
                        height={160}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Right Column - Content */}
                  <div className="flex-1 md:w-3/5 flex flex-col min-w-0">
                    {/* Header with icon, title, status, priority */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-lg flex items-center justify-center text-white text-xl shadow-md flex-shrink-0`}
                        >
                          {getServiceIcon(request.type)}
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 leading-tight">
                          {request.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(request.status)}
                        {getUrgencyBadge(request.priority)}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex-1 mb-4">
                      <p className="text-gray-700 leading-relaxed line-clamp-4 text-base">
                        {request.description}
                      </p>
                    </div>

                    {/* Service Type */}
                    <div className="mt-auto">
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                        {request.type}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export default RequestHistory;
