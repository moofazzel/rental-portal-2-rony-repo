"use client";

import { getAllNotices } from "@/app/apiClient/adminApi";
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
import { INotice } from "@/types/notices.types";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  MapPin,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CreateNoticeModal from "./CreateNoticeModal";

interface GroupedNotices {
  [propertyId: string]: {
    property: {
      _id: string;
      name: string;
    };
    notices: INotice[];
  };
}

export function NoticesManagement() {
  const [groupedData, setGroupedData] = useState<GroupedNotices>({});
  const [filteredData, setFilteredData] = useState<GroupedNotices>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "EXPIRED"
  >("ALL");
  const [priorityFilter, setPriorityFilter] = useState<
    "ALL" | "HIGH" | "MEDIUM" | "LOW"
  >("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");

  // const priorityMap: Record<"HIGH" | "MEDIUM" | "LOW", AnnouncementPriority> = {
  //   HIGH: "High",
  //   MEDIUM: "Medium",
  //   LOW: "Low",
  // };

  console.log(setGroupedData);

  const { data: noticesResponse, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: getAllNotices,
  });

  const notices: INotice[] = useMemo(
    () => noticesResponse?.data || [],
    [noticesResponse?.data]
  );

  // useEffect(() => {
  //   // Group data by property
  //   const grouped = notices.reduce((acc, notice) => {
  //     const propertyId = notice.propertyId._id;
  //     if (!acc[propertyId]) {
  //       acc[propertyId] = {
  //         property: notice.propertyId,
  //         notices: [],
  //       };
  //     }
  //     acc[propertyId].notices.push(notice);
  //     return acc;
  //   }, {} as GroupedNotices);

  //   setGroupedData(grouped);
  // }, [notices]);

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
      }, {} as GroupedNotices);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredNotices = property.notices.filter(
          (notice) =>
            notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // notice.propertyId.name
            //   .toLowerCase()
            //   .includes(searchTerm.toLowerCase()) ||
            notice.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        if (filteredNotices.length > 0) {
          acc[propertyId] = {
            ...property,
            notices: filteredNotices,
          };
        }
        return acc;
      }, {} as GroupedNotices);
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredNotices = property.notices.filter((notice) => {
          if (statusFilter === "ACTIVE") {
            return notice.isCurrentlyActive && !notice.isExpired;
          } else if (statusFilter === "EXPIRED") {
            return notice.isExpired;
          }
          return true;
        });

        if (filteredNotices.length > 0) {
          acc[propertyId] = {
            ...property,
            notices: filteredNotices,
          };
        }
        return acc;
      }, {} as GroupedNotices);
    }

    // Filter by priority
    //     if (priorityFilter !== "ALL") {
    //       filtered = Object.keys(filtered).reduce((acc, propertyId) => {
    //         const property = filtered[propertyId];
    //       const filteredNotices = property.notices.filter((notice) => {
    //   if (priorityFilter === "ALL") return true;
    //   return notice.priority === priorityMap[priorityFilter];
    // });

    //         if (filteredNotices.length > 0) {
    //           acc[propertyId] = {
    //             ...property,
    //             notices: filteredNotices,
    //           };
    //         }
    //         return acc;
    //       }, {} as GroupedNotices);
    //     }

    // Filter by type
    if (typeFilter !== "ALL") {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredNotices = property.notices.filter(
          (notice) => notice?.type === typeFilter
        );

        if (filteredNotices.length > 0) {
          acc[propertyId] = {
            ...property,
            notices: filteredNotices,
          };
        }
        return acc;
      }, {} as GroupedNotices);
    }

    // Sort notices within each property
    Object.keys(filtered).forEach((propertyId) => {
      filtered[propertyId].notices.sort((a, b) => {
        if (sortBy === "date") {
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
        }
        if (sortBy === "priority") {
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          const aPriority =
            priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority =
            priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          return sortOrder === "asc"
            ? aPriority - bPriority
            : bPriority - aPriority;
        }
        if (sortBy === "status") {
          const statusOrder = {
            ACTIVE: 1,
            EXPIRED: 2,
          };
          const aStatus = a.isExpired ? "EXPIRED" : "ACTIVE";
          const bStatus = b.isExpired ? "EXPIRED" : "ACTIVE";
          const aStatusOrder = statusOrder[aStatus as keyof typeof statusOrder];
          const bStatusOrder = statusOrder[bStatus as keyof typeof statusOrder];
          return sortOrder === "asc"
            ? aStatusOrder - bStatusOrder
            : bStatusOrder - aStatusOrder;
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

  const getStatusIcon = (notice: INotice) => {
    if (notice.isExpired) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    if (notice.isCurrentlyActive) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (notice: INotice) => {
    if (notice.isExpired) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (notice.isCurrentlyActive) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return "📢";
      case "MAINTENANCE":
        return "🔧";
      case "EMERGENCY":
        return "🚨";
      case "EVENT":
        return "🎉";
      case "GENERAL":
        return "📋";
      default:
        return "📄";
    }
  };

  const getStatusText = (notice: INotice) => {
    if (notice.isExpired) {
      return "EXPIRED";
    }
    if (notice.isCurrentlyActive) {
      return "ACTIVE";
    }
    return "PENDING";
  };

  const totalNotices = Object.values(filteredData).reduce(
    (acc, property) => acc + property.notices.length,
    0
  );
  const activeNotices = Object.values(filteredData).reduce(
    (acc, property) =>
      acc +
      property.notices.filter((n) => n.isCurrentlyActive && !n.isExpired)
        .length,
    0
  );
  const highPriorityNotices = Object.values(filteredData).reduce(
    (acc, property) =>
      acc +
      property.notices.filter((n) => n.priority?.toLowerCase() === "high")
        .length,
    0
  );

  const propertyStats = Object.entries(groupedData).map(
    ([propertyId, propertyData]) => ({
      id: propertyId,
      name: propertyData.property.name,
      totalNotices: propertyData.notices.length,
      activeNotices: propertyData.notices.filter(
        (n) => n.isCurrentlyActive && !n.isExpired
      ).length,
      highPriorityNotices: propertyData.notices.filter(
        (n) => n.priority?.toLowerCase() === "high"
      ).length,
    })
  );

  const uniqueTypes = Array.from(
    new Set(notices.map((notice) => notice.type))
  ).sort();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Community Notices
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track community notices across all properties
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3">
          <Card className="min-w-[90px] p-0 border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-blue-600">
                {totalNotices}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Total Notices
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] p-0 border-l-4 border-l-green-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-green-600">
                {activeNotices}
              </div>
              <div className="text-xs text-gray-500 font-medium">Active</div>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] p-0 border-l-4 border-l-red-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-red-600">
                {highPriorityNotices}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                High Priority
              </div>
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
                  (acc, property) => acc + property.notices.length,
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
                  {property.totalNotices}
                </Badge>
                {property.highPriorityNotices > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {property.highPriorityNotices} urgent
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
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "ALL" | "ACTIVE" | "EXPIRED")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value) =>
                setPriorityFilter(value as "ALL" | "HIGH" | "MEDIUM" | "LOW")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
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

      {/* Create Notice Button */}
      <div className="flex justify-end">
        <CreateNoticeModal />
      </div>

      {/* Property Groups */}
      <div className="space-y-6">
        {Object.entries(filteredData).map(([propertyId, propertyData]) => (
          <Card key={propertyId} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {propertyData.property.name}
                <Badge variant="outline" className="ml-auto">
                  {propertyData.notices.length} notices
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Notice
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
                        Views
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Published Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyData.notices.map((notice, index) => (
                      <tr
                        key={notice?.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">
                              {notice?.title}
                            </div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {notice?.content}
                            </div>
                            {notice?.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {notice?.tags
                                  .slice(0, 3)
                                  .map((tag, tagIndex) => (
                                    <Badge
                                      key={tagIndex}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                {notice?.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{notice.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span>{getTypeIcon(notice?.type)}</span>
                            <span className="text-sm">{notice?.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getPriorityColor(notice.priority)}>
                            {notice?.priority}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(notice)}
                            <Badge className={getStatusColor(notice)}>
                              {getStatusText(notice)}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {notice?.readCount || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(notice?.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <FileText className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Bell className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
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
              No notices found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default NoticesManagement;
