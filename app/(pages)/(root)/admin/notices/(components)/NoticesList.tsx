"use client";

import { getAllNotices } from "@/app/apiClient/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Megaphone, Search, SortAsc, SortDesc } from "lucide-react";
import { useMemo, useState } from "react";
import CreateNoticeModal from "./CreateNoticeModal";
import { NoticeCard } from "./NoticeCard";
import { NoticeCardSkeleton } from "./NoticeCardSkeleton";

export default function NoticeList() {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const itemsPerPage = 8;

  const { data: notices, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: getAllNotices,
  });

  console.log(notices?.data);
  // Filter and sort notices
  const filteredAndSortedNotices = useMemo(() => {
    let allNotices: INotice[] = notices?.data ?? [];

    // Apply search filter
    if (searchTerm) {
      allNotices = allNotices.filter(
        (notice) =>
          notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notice.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      allNotices = allNotices.filter(
        (notice) => notice.priority === priorityFilter
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        allNotices = allNotices.filter(
          (notice) => notice.isActive && !notice.isExpired
        );
      } else if (statusFilter === "expired") {
        allNotices = allNotices.filter((notice) => notice.isExpired);
      } else if (statusFilter === "inactive") {
        allNotices = allNotices.filter((notice) => !notice.isActive);
      }
    }

    // Sort notices
    return [...allNotices].sort((a, b) => {
      const da = new Date(a.createdAt);
      const db = new Date(b.createdAt);

      if (isNaN(da.getTime()) || isNaN(db.getTime())) return 0;

      return sortOrder === "newest"
        ? db.getTime() - da.getTime()
        : da.getTime() - db.getTime();
    });
  }, [notices?.data, sortOrder, searchTerm, priorityFilter, statusFilter]);

  // Paginate notices
  const paginatedNotices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedNotices.slice(start, start + itemsPerPage);
  }, [filteredAndSortedNotices, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedNotices.length / itemsPerPage);

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

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Notices</h2>
          <p className="text-gray-600 mt-1">
            Showing {filteredAndSortedNotices.length} of{" "}
            {notices?.data?.length || 0} notices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreateNoticeModal />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Priority Filter */}
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Button
          variant="outline"
          onClick={() =>
            setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
          }
          className="flex items-center gap-2"
        >
          {sortOrder === "newest" ? (
            <SortDesc className="h-4 w-4" />
          ) : (
            <SortAsc className="h-4 w-4" />
          )}
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </Button>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || priorityFilter !== "all" || statusFilter !== "all") && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Search: &quot;{searchTerm}&quot;
            </Badge>
          )}
          {priorityFilter !== "all" && (
            <Badge
              variant="outline"
              className={getPriorityColor(priorityFilter)}
            >
              Priority: {priorityFilter}
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              Status: {statusFilter}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setPriorityFilter("all");
              setStatusFilter("all");
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Notices Grid */}
      <div className="grid gap-4">
        {isLoading ? (
          <>
            <NoticeCardSkeleton />
            <NoticeCardSkeleton />
            <NoticeCardSkeleton />
            <NoticeCardSkeleton />
          </>
        ) : paginatedNotices.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Megaphone className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notices found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ||
                priorityFilter !== "all" ||
                statusFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "Get started by creating your first notice."}
              </p>
              {!searchTerm &&
                priorityFilter === "all" &&
                statusFilter === "all" && <CreateNoticeModal />}
            </div>
          </div>
        ) : (
          paginatedNotices?.map((notice, index) => (
            <NoticeCard
              key={
                (notice as any)._id ||
                notice.id ||
                `notice-list-${index}-${notice?.createdAt || index}`
              }
              notice={notice}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(
              currentPage * itemsPerPage,
              filteredAndSortedNotices.length
            )}{" "}
            of {filteredAndSortedNotices.length} notices
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
