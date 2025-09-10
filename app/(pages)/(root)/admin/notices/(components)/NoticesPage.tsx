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
import { AnnouncementPriority, INotice } from "@/types/notices.types";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bell,
  BellPlus,
  Calendar,
  Clock,
  Eye,
  Filter,
  MapPin,
  Megaphone,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import CreateNoticeModal from "./CreateNoticeModal";
import UpdateNoticeModal from "./UpdateNoticeModal";

interface GroupedNotices {
  [propertyId: string]: {
    property: {
      _id: string;
      name: string;
    };
    notices: INotice[];
  };
}

export default function NoticesPage({ notices }: { notices: INotice[] }) {
  const [groupedData, setGroupedData] = useState<GroupedNotices>({});
  const [filteredData, setFilteredData] = useState<GroupedNotices>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<INotice | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "expired" | "pending"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "urgent" | "high" | "medium" | "low"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");

  // Group notices by property
  useMemo(() => {
    const grouped = notices?.reduce((acc, notice) => {
      if (notice.propertyId && typeof notice.propertyId === "object") {
        const propertyId = notice.propertyId._id;
        if (!acc[propertyId]) {
          acc[propertyId] = {
            property: notice.propertyId,
            notices: [],
          };
        }
        acc[propertyId].notices?.push(notice);
      } else if (notice.propertyId && typeof notice.propertyId === "string") {
        // Handle string propertyId (unpopulated reference)
        const propertyId = notice.propertyId;
        if (!acc[propertyId]) {
          acc[propertyId] = {
            property: {
              _id: propertyId,
              name: `Property ${propertyId}`,
            },
            notices: [],
          };
        }
        acc[propertyId].notices?.push(notice);
      } else {
        // Handle notices without property assignment
        const noPropertyId = "no-property";
        if (!acc[noPropertyId]) {
          acc[noPropertyId] = {
            property: {
              _id: noPropertyId,
              name: "Unassigned",
            },
            notices: [],
          };
        }
        acc[noPropertyId].notices?.push(notice);
      }
      return acc;
    }, {} as GroupedNotices);

    setGroupedData(grouped);
  }, [notices]);

  // Apply filters and sorting
  useMemo(() => {
    let filtered = { ...groupedData };

    // Filter by selected property
    if (selectedProperty !== "all") {
      filtered = Object.keys(filtered)?.reduce((acc, propertyId) => {
        if (propertyId === selectedProperty) {
          acc[propertyId] = filtered[propertyId];
        }
        return acc;
      }, {} as GroupedNotices);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = Object.keys(filtered)?.reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredNotices = property.notices.filter(
          (notice) =>
            notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    if (statusFilter !== "all") {
      filtered = Object.keys(filtered)?.reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredNotices = property.notices.filter((notice) => {
          if (statusFilter === "active") {
            return notice.isCurrentlyActive && !notice.isExpired;
          } else if (statusFilter === "expired") {
            return notice.isExpired;
          } else if (statusFilter === "pending") {
            return !notice.isCurrentlyActive && !notice.isExpired;
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
    if (priorityFilter !== "all") {
      filtered = Object.keys(filtered)?.reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredNotices = property.notices.filter(
          (notice) => notice.priority.toLowerCase() === priorityFilter
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
          const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          const aPriority =
            priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority =
            priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          return sortOrder === "asc"
            ? aPriority - bPriority
            : bPriority - aPriority;
        }
        if (sortBy === "status") {
          const statusOrder = { active: 1, pending: 2, expired: 3 };
          const aStatus = a.isExpired
            ? "expired"
            : a.isCurrentlyActive
            ? "active"
            : "pending";
          const bStatus = b.isExpired
            ? "expired"
            : b.isCurrentlyActive
            ? "active"
            : "pending";
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
    sortBy,
    sortOrder,
    selectedProperty,
  ]);

  const getStatusColor = (notice: INotice) => {
    if (notice.isExpired) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (notice.isCurrentlyActive) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-200 text-red-900 border-red-300";
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

  const getStatusText = (notice: INotice) => {
    if (notice.isExpired) {
      return "EXPIRED";
    }
    if (notice.isCurrentlyActive) {
      return "ACTIVE";
    }
    return "PENDING";
  };

  const getStatusIcon = (notice: INotice) => {
    if (notice.isExpired) {
      return <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />;
    }
    if (notice.isCurrentlyActive) {
      return <Eye className="h-4 w-4 text-green-500 flex-shrink-0" />;
    }
    return <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0" />;
  };

  const totalNotices = Object.values(filteredData)?.reduce(
    (acc, property) => acc + property.notices.length,
    0
  );
  const activeNotices = Object.values(filteredData)?.reduce(
    (acc, property) =>
      acc +
      property.notices.filter((n) => n.isCurrentlyActive && !n.isExpired)
        .length,
    0
  );
  const highPriorityNotices = Object.values(filteredData)?.reduce(
    (acc, property) =>
      acc +
      property.notices.filter(
        (n) => n.priority === "HIGH" || n.priority === "URGENT"
      ).length,
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
        (n) =>
          n.priority === ("HIGH" as AnnouncementPriority) ||
          n.priority === ("URGENT" as AnnouncementPriority)
      ).length,
    })
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BellPlus className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Property Notices</h1>
          <p className="text-gray-600 mt-1">
            Manage and track property notices across all properties
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
                High/Urgent
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Property Navigation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Properties
          </CardTitle>

          {/* Create Notice Modal */}
          <CreateNoticeModal />
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedProperty === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedProperty("all")}
              className="flex items-center gap-2 transition-colors"
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
                className="flex items-center gap-2 transition-colors hover:shadow-sm"
              >
                <span>{property.name}</span>
                <Badge variant="secondary" className="ml-1">
                  {property.totalNotices}
                </Badge>
                {property.highPriorityNotices > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
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
                setStatusFilter(
                  value as "all" | "active" | "expired" | "pending"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value) =>
                setPriorityFilter(
                  value as "all" | "urgent" | "high" | "medium" | "low"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </Button>
            </div>
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
                        Expiry Date
                      </th>
                      {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th> */}
                    </tr>
                  </thead>

                  <tbody className="cursor-pointer">
                    {propertyData.notices.map((notice, index) => {
                      // Ensure we have a unique key, fallback to composite key if no ID
                      const uniqueKey =
                        (notice as any)?._id ||
                        notice?.id ||
                        `notice-${propertyId}-${index}-${
                          notice?.createdAt || index
                        }`;
                      return (
                        <tr
                          key={uniqueKey}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 transition-colors duration-200 ${
                            notice.priority === "URGENT"
                              ? "border-l-4 border-l-red-500"
                              : notice.priority === "HIGH"
                              ? "border-l-4 border-l-orange-500"
                              : notice.priority === "MEDIUM"
                              ? "border-l-4 border-l-yellow-500"
                              : "border-l-4 border-l-green-500"
                          }`}
                          onClick={() => {
                            setSelectedNotice(notice);
                            setModalOpen(true);
                          }}
                        >
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-gray-900">
                                {notice?.title}
                              </div>
                              <div className="text-sm text-gray-600 line-clamp-2">
                                {notice?.content
                                  ?.split(" ")
                                  .slice(0, 15)
                                  .join(" ") + "..."}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-blue-600">
                                {notice?.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={getPriorityColor(notice.priority)}
                            >
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
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">
                                {notice?.expiryDate
                                  ? new Date(
                                      notice?.expiryDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Megaphone className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notices found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ||
                statusFilter !== "all" ||
                priorityFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "Get started by creating your first notice."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {/* ✅ Modal Rendered Below */}
      {selectedNotice && (
        <UpdateNoticeModal
          notice={selectedNotice}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          onUpdate={() => setSelectedNotice(null)} // Optional close
        />
      )}
    </div>
  );
}
