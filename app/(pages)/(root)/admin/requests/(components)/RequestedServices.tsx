"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle,
  Clock,
  Cog,
  Filter,
  MapPin,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  IServiceRequest,
  ServiceRequestPriority,
  ServiceRequestStatus,
  ServiceRequestType,
} from "../types/service-request";
import ServiceRequestModal from "./ServiceRequestModal";

interface GroupedRequests {
  [propertyId: string]: {
    property: {
      _id: string;
      name: string;
      address: {
        street: string;
        city: string;
        state: string;
        zip: string;
      };
    };
    requests: IServiceRequest[];
  };
}

export function RequestedServices({
  serviceRequests,
}: {
  serviceRequests: IServiceRequest[];
}) {
  const [groupedData, setGroupedData] = useState<GroupedRequests>({});
  const [filteredData, setFilteredData] = useState<GroupedRequests>({});
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    ServiceRequestStatus | "ALL"
  >("ALL");
  const [priorityFilter, setPriorityFilter] = useState<
    ServiceRequestPriority | "ALL"
  >("ALL");
  const [typeFilter, setTypeFilter] = useState<ServiceRequestType | "ALL">(
    "ALL"
  );
  const [sortBy, setSortBy] = useState<"date" | "priority" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<IServiceRequest | null>(null);

  useEffect(() => {
    console.log("Processing service requests:", serviceRequests.length);

    // Group data by property
    const grouped = serviceRequests.reduce((acc, request) => {
      console.log(
        "Processing request:",
        request._id,
        "propertyId:",
        request.propertyId
      );

      // Skip requests with null propertyId
      if (!request.propertyId) {
        console.warn("Service request with null propertyId:", request._id);
        return acc;
      }

      const propertyId = request.propertyId._id;
      if (!acc[propertyId]) {
        acc[propertyId] = {
          property: request.propertyId,
          requests: [],
        };
      }
      acc[propertyId].requests.push(request);
      return acc;
    }, {} as GroupedRequests);

    console.log("Grouped data:", grouped);
    setGroupedData(grouped);
  }, [serviceRequests]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = { ...groupedData };

    // Filter by selected property
    if (selectedProperty !== "all") {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        if (propertyId === selectedProperty) {
          acc[propertyId] = filtered[propertyId];
        }
        return acc;
      }, {} as GroupedRequests);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredRequests = property.requests.filter(
          (request) =>
            request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (request.tenantId?.name || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (request.propertyId?.name || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            request.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredRequests.length > 0) {
          acc[propertyId] = {
            ...property,
            requests: filteredRequests,
          };
        }
        return acc;
      }, {} as GroupedRequests);
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredRequests = property.requests.filter(
          (request) => request.status === statusFilter
        );

        if (filteredRequests.length > 0) {
          acc[propertyId] = {
            ...property,
            requests: filteredRequests,
          };
        }
        return acc;
      }, {} as GroupedRequests);
    }

    // Filter by priority
    if (priorityFilter !== "ALL") {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredRequests = property.requests.filter(
          (request) => request.priority === priorityFilter
        );

        if (filteredRequests.length > 0) {
          acc[propertyId] = {
            ...property,
            requests: filteredRequests,
          };
        }
        return acc;
      }, {} as GroupedRequests);
    }

    // Filter by type
    if (typeFilter !== "ALL") {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredRequests = property.requests.filter(
          (request) => request.type === typeFilter
        );

        if (filteredRequests.length > 0) {
          acc[propertyId] = {
            ...property,
            requests: filteredRequests,
          };
        }
        return acc;
      }, {} as GroupedRequests);
    }

    // Sort requests within each property
    Object.keys(filtered).forEach((propertyId) => {
      filtered[propertyId].requests.sort((a, b) => {
        if (sortBy === "date") {
          const aDate = new Date(a.requestedDate).getTime();
          const bDate = new Date(b.requestedDate).getTime();
          return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
        }
        if (sortBy === "priority") {
          const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          const aPriority = priorityOrder[a.priority];
          const bPriority = priorityOrder[b.priority];
          return sortOrder === "asc"
            ? aPriority - bPriority
            : bPriority - aPriority;
        }
        if (sortBy === "status") {
          const statusOrder = {
            PENDING: 1,
            IN_PROGRESS: 2,
            COMPLETED: 3,
            CANCELLED: 4,
          };
          const aStatus = statusOrder[a.status];
          const bStatus = statusOrder[b.status];
          return sortOrder === "asc" ? aStatus - bStatus : bStatus - aStatus;
        }
        return 0;
      });
    });

    setFilteredData(filtered);
  }, [
    groupedData,
    searchTerm,
    statusFilter,
    priorityFilter,
    typeFilter,
    sortBy,
    sortOrder,
    selectedProperty,
  ]);

  const getStatusIcon = (status: ServiceRequestStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "IN_PROGRESS":
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getPriorityColor = (priority: ServiceRequestPriority) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getStatusColor = (status: ServiceRequestStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getTypeIcon = (type: ServiceRequestType) => {
    switch (type) {
      case "MAINTENANCE":
        return "🔧";
      case "UTILITY":
        return "⚡";
      case "SECURITY":
        return "🔒";
      case "CLEANING":
        return "🧹";
      case "OTHER":
        return "📋";
    }
  };

  const totalRequests = Object.values(filteredData).reduce(
    (acc, property) => acc + property.requests.length,
    0
  );
  const pendingRequests = Object.values(filteredData).reduce(
    (acc, property) =>
      acc + property.requests.filter((r) => r.status === "PENDING").length,
    0
  );
  const urgentRequests = Object.values(filteredData).reduce(
    (acc, property) =>
      acc + property.requests.filter((r) => r.priority === "URGENT").length,
    0
  );

  const propertyStats = Object.entries(groupedData).map(
    ([propertyId, propertyData]) => ({
      id: propertyId,
      name: propertyData.property.name,
      totalRequests: propertyData.requests.length,
      pendingRequests: propertyData.requests.filter(
        (r) => r.status === "PENDING"
      ).length,
      urgentRequests: propertyData.requests.filter(
        (r) => r.priority === "URGENT"
      ).length,
    })
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Cog className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage and track service requests across all properties
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3">
          <Card className="min-w-[90px] p-0 border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-blue-600">
                {totalRequests}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Total Requests
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] p-0 border-l-4 border-l-yellow-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-yellow-600">
                {pendingRequests}
              </div>
              <div className="text-xs text-gray-500 font-medium">Pending</div>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] p-0 border-l-4 border-l-red-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-red-600">
                {urgentRequests}
              </div>
              <div className="text-xs text-gray-500 font-medium">Urgent</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Property Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedProperty === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedProperty("all")}
              className="flex items-center gap-2"
            >
              <span>All Properties</span>
              <Badge variant="secondary" className="ml-1">
                {Object.values(groupedData).reduce(
                  (acc, property) => acc + property.requests.length,
                  0
                )}
              </Badge>
            </Button>

            {propertyStats.map((property) => (
              <Button
                key={property.id}
                variant={
                  selectedProperty === property.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedProperty(property.id)}
                className="flex items-center gap-2"
              >
                <span>{property.name}</span>
                <Badge variant="secondary" className="ml-1">
                  {property.totalRequests}
                </Badge>
                {property.urgentRequests > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {property.urgentRequests} urgent
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as ServiceRequestStatus | "ALL")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value) =>
                setPriorityFilter(value as ServiceRequestPriority | "ALL")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as ServiceRequestType | "ALL")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="UTILITY">Utility</SelectItem>
                <SelectItem value="SECURITY">Security</SelectItem>
                <SelectItem value="CLEANING">Cleaning</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "date" | "priority" | "status")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Groups */}
      <div className="space-y-6">
        {Object.entries(filteredData).map(([propertyId, propertyData]) => (
          <Card key={propertyId} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {propertyData.property.name}
                <Badge variant="outline" className="ml-auto">
                  {propertyData.requests.length} requests
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                {propertyData.property.address.street},{" "}
                {propertyData.property.address.city},{" "}
                {propertyData.property.address.state}{" "}
                {propertyData.property.address.zip}
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Request
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Tenant
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyData.requests.map((request, index) => (
                      <tr
                        key={request._id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors duration-200`}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">
                              {request.title}
                            </div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {request.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {(() => {
                                console.log(
                                  "Rendering tenant for request:",
                                  request._id,
                                  "tenantId:",
                                  request.tenantId
                                );
                                return (
                                  request.tenantId?.name || "Unknown Tenant"
                                );
                              })()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span>{getTypeIcon(request.type)}</span>
                            <span className="text-sm">{request.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <Badge className={getStatusColor(request.status)}>
                              {request.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(
                                request.requestedDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedService(request);
                              setModalOpen(true);
                            }}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(filteredData).length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              No service requests found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedService && (
        <ServiceRequestModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          request={selectedService}
        />
      )}
    </div>
  );
}

// Helper functions
