"use client";

import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INotice } from "@/types/notices.types";
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  ListFilter,
  MapPin,
  Tag,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

type NoticeTableProps = {
  notices: INotice[];
};

export function NoticeTable({ notices }: NoticeTableProps) {
  const [query, setQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("NEWEST");

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (notice: INotice) =>
    notice.isActive ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );

  const getStatusColor = (notice: INotice) =>
    notice.isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-200 text-gray-600 border-gray-300";

  const getStatusText = (notice: INotice) =>
    notice.isActive ? (notice.isExpired ? "Expired" : "Active") : "Inactive";

  const filtered = useMemo(() => {
    let list = [...notices];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((n) =>
        [n.title, n.content, ...(n.tags || [])]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q))
      );
    }

    if (typeFilter !== "ALL") {
      list = list.filter((n) => n.type === typeFilter);
    }

    if (priorityFilter !== "ALL") {
      list = list.filter(
        (n) => (n.priority || "").toString() === priorityFilter
      );
    }

    if (statusFilter !== "ALL") {
      if (statusFilter === "ACTIVE")
        list = list.filter((n) => n.isActive && !n.isExpired);
      if (statusFilter === "INACTIVE") list = list.filter((n) => !n.isActive);
      if (statusFilter === "EXPIRED") list = list.filter((n) => n.isExpired);
    }

    if (sortBy === "NEWEST") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "EXPIRY_ASC") {
      list.sort(
        (a, b) =>
          new Date(a.expiryDate || 0).getTime() -
          new Date(b.expiryDate || 0).getTime()
      );
    } else if (sortBy === "EXPIRY_DESC") {
      list.sort(
        (a, b) =>
          new Date(b.expiryDate || 0).getTime() -
          new Date(a.expiryDate || 0).getTime()
      );
    }

    return list;
  }, [notices, query, typeFilter, priorityFilter, statusFilter, sortBy]);

  return (
    <CardContent className="p-0">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <Bell className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Community Notices</h2>
            <span className="text-sm text-gray-500">
              {notices.length} total
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1 min-w-[220px]">
              <Input
                placeholder="Search notices..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
              <ListFilter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="EVENT">Event</SelectItem>
                <SelectItem value="SECURITY">Security</SelectItem>
                <SelectItem value="BILLING">Billing</SelectItem>
                <SelectItem value="EMERGENCY">Emergency</SelectItem>
                <SelectItem value="RULE_UPDATE">Rule Update</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priority</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEWEST">Newest</SelectItem>
                <SelectItem value="EXPIRY_ASC">Expiry: Soonest</SelectItem>
                <SelectItem value="EXPIRY_DESC">Expiry: Latest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg">
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
                  Property
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Expiry
                </th>
              </tr>
            </thead>
            <tbody className="cursor-pointer">
              {filtered.map((notice, index) => {
                const propertyName =
                  typeof notice.propertyId === "string"
                    ? "—"
                    : notice.propertyId?.name || "—";
                const createdAt = new Date(
                  notice.createdAt
                ).toLocaleDateString();
                const expiry = notice.expiryDate
                  ? new Date(notice.expiryDate).toLocaleDateString()
                  : "—";
                return (
                  <tr
                    key={notice.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {notice.title}
                          {notice.tags && notice.tags.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Tag className="w-3 h-3" />{" "}
                              {notice.tags.slice(0, 2).join(", ")}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {notice.content}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-blue-600">
                          {notice.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getPriorityColor(notice.priority)}>
                        {notice.priority || "N/A"}
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
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{propertyName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{createdAt}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{expiry}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No notices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CardContent>
  );
}
