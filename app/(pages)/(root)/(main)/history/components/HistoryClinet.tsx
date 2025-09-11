"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { useState } from "react";

type Payment = {
  id: string;
  datePaid: string;
  amount: number;
  status: string;
  method: string;
  confirmationId: string;
  propertyName: string;
  description: string;
  receiptNumber: string;
  source: string;
};

const statusVariant = {
  Paid: "default",
  PAID: "default",
  Refunded: "secondary",
  REFUNDED: "secondary",
  Unpaid: "destructive",
  PENDING: "destructive",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
} as const;

const ITEMS_PER_PAGE = 10;

interface HistoryClientProps {
  payments?: {
    payments: Payment[];
    summary: {
      totalPaid: number;
      totalPayments: number;
      successRate: number;
      overdueAmount: number;
    };
  } | null;
  error?: string;
}

export default function HistoryClient({ payments, error }: HistoryClientProps) {
  const [sortedBy, setSortedBy] = useState<"date" | "amount" | "status">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Transform API data to match the component's expected format
  const transformPayments = (
    payments: HistoryClientProps["payments"]
  ): Payment[] => {
    if (!payments || !payments.payments || !Array.isArray(payments.payments)) {
      return [];
    }

    return payments.payments.map((payment) => ({
      id: payment.id,
      datePaid: payment.datePaid,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
      confirmationId: payment.confirmationId,
      propertyName: payment.propertyName,
      description: payment.description,
      receiptNumber: payment.receiptNumber,
      source: payment.source,
    }));
  };

  const data = transformPayments(payments || null);

  const filteredData = data.filter(
    (item) =>
      item.datePaid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.amount.toString().includes(searchTerm.toLowerCase()) ||
      item.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortedBy) return 0;

    if (sortedBy === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }

    if (sortedBy === "date") {
      const aVal = new Date(a.datePaid).getTime();
      const bVal = new Date(b.datePaid).getTime();
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }

    if (sortedBy === "status") {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSort = (column: "date" | "amount" | "status") => {
    if (sortedBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortedBy(column);
      setSortOrder("asc");
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    for (let i = 1; i <= totalPages && i <= maxVisible; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "secondary" : "outline"}
          className="px-3 py-1"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {pages}
        {totalPages > 5 && <span className="px-2 text-gray-500">...</span>}
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </>
    );
  };

  const totalPaid = payments?.summary?.totalPaid || 0;
  const totalPayments = payments?.summary?.totalPayments || 0;
  const successRate = payments?.summary?.successRate || 0;
  const overdueAmount = payments?.summary?.overdueAmount || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Payment History
            </h1>
            <p className="text-slate-600 mt-2">
              View your complete payment history and download receipts.
            </p>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
        </div>

        {/* Error Banner */}
        {error && (
          <Card className="shadow-lg border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-800 font-medium">
                    Error Loading Payment History
                  </p>
                  <p className="text-red-600 text-sm">{error}</p>
                  <p className="text-red-500 text-xs mt-1">
                    Showing fallback data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Paid</p>
                  <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Payments</p>
                  <p className="text-2xl font-bold">{totalPayments}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold">{successRate}%</p>
                </div>
                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Overdue Amount</p>
                  <p className="text-2xl font-bold">
                    ${overdueAmount.toFixed(2)}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Payment Records
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search payments by date, amount, method, status, property, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer text-gray-700 hover:bg-gray-50"
                      onClick={() => toggleSort("date")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date Paid</span>
                        {sortedBy === "date" &&
                          (sortOrder === "asc" ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer text-gray-700 hover:bg-gray-50"
                      onClick={() => toggleSort("amount")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Amount</span>
                        {sortedBy === "amount" &&
                          (sortOrder === "asc" ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer text-gray-700 hover:bg-gray-50"
                      onClick={() => toggleSort("status")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        {sortedBy === "status" &&
                          (sortOrder === "asc" ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-700">Method</TableHead>
                    <TableHead className="text-gray-700">Property</TableHead>
                    <TableHead className="text-gray-700">Description</TableHead>
                    <TableHead className="text-gray-700">
                      Receipt Number
                    </TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item, i) => (
                    <TableRow key={i} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {new Date(item.datePaid).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${item.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statusVariant[
                              item.status as keyof typeof statusVariant
                            ] || "default"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.method}</TableCell>
                      <TableCell className="text-sm">
                        {item.propertyName}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 font-mono">
                        {item.receiptNumber}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {renderPageNumbers()}
              </div>
            )}

            {/* No Results */}
            {paginatedData.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No payment records found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
