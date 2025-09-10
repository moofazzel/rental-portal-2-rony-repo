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
import { IAdminPayment, PaymentStatus } from "@/types/payment.types";
import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  Filter,
  MapPin,
  Receipt,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

interface PaymentsPageProps {
  payments: IAdminPayment[];
}

interface GroupedPayments {
  [propertyId: string]: {
    property: {
      id: string;
      name: string;
      address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
    };
    payments: IAdminPayment[];
  };
}

export default function PaymentsPage({ payments }: PaymentsPageProps) {
  const [groupedData, setGroupedData] = useState<GroupedPayments>({});
  const [filteredData, setFilteredData] = useState<GroupedPayments>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">(
    "ALL"
  );
  const [sortBy, setSortBy] = useState<
    "dueDate" | "amount" | "status" | "createdAt"
  >("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");

  // Group payments by property
  useMemo(() => {
    const grouped = payments.reduce((acc, payment) => {
      if (payment.property) {
        const propertyId = payment.property.id;
        if (!acc[propertyId]) {
          acc[propertyId] = {
            property: {
              id: propertyId,
              name: payment.property.name,
              address: payment.property.address,
            },
            payments: [],
          };
        }
        acc[propertyId].payments.push(payment);
      }
      return acc;
    }, {} as GroupedPayments);

    setGroupedData(grouped);
  }, [payments]);

  // Apply filters and sorting
  useMemo(() => {
    let filtered = { ...groupedData };

    // Filter by selected property
    if (selectedProperty !== "all") {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        if (propertyId === selectedProperty) {
          acc[propertyId] = filtered[propertyId];
        }
        return acc;
      }, {} as GroupedPayments);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredPayments = property.payments.filter(
          (payment) =>
            payment.tenant.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            payment.tenant.email
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            payment.tenant.phoneNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            payment.property.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            payment.spot.spotNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            payment.receiptNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );

        if (filteredPayments.length > 0) {
          acc[propertyId] = {
            ...property,
            payments: filteredPayments,
          };
        }
        return acc;
      }, {} as GroupedPayments);
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredPayments = property.payments.filter(
          (payment) => payment.status === statusFilter
        );

        if (filteredPayments.length > 0) {
          acc[propertyId] = {
            ...property,
            payments: filteredPayments,
          };
        }
        return acc;
      }, {} as GroupedPayments);
    }

    // Sort payments within each property
    Object.keys(filtered).forEach((propertyId) => {
      filtered[propertyId].payments.sort((a, b) => {
        let aValue: string | number | Date;
        let bValue: string | number | Date;

        switch (sortBy) {
          case "dueDate":
            aValue = new Date(a.dueDate);
            bValue = new Date(b.dueDate);
            break;
          case "amount":
            aValue = a.amount;
            bValue = b.amount;
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "createdAt":
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    });

    setFilteredData(filtered);
  }, [
    groupedData,
    searchTerm,
    statusFilter,
    sortBy,
    sortOrder,
    selectedProperty,
  ]);

  const statusVariant = {
    PAID: "default",
    PENDING: "secondary",
    OVERDUE: "destructive",
    CANCELLED: "outline",
    REFUNDED: "outline",
  } as const;

  const statusLabels = {
    PAID: "Paid",
    PENDING: "Pending",
    OVERDUE: "Overdue",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  } as const;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate stats
  const totalPayments = Object.values(filteredData).reduce(
    (acc, property) => acc + property.payments.length,
    0
  );
  const totalAmount = Object.values(filteredData).reduce(
    (acc, property) =>
      acc + property.payments.reduce((sum, payment) => sum + payment.amount, 0),
    0
  );
  const pendingPayments = Object.values(filteredData).reduce(
    (acc, property) =>
      acc + property.payments.filter((p) => p.status === "PENDING").length,
    0
  );
  const overduePayments = Object.values(filteredData).reduce(
    (acc, property) =>
      acc + property.payments.filter((p) => p.status === "OVERDUE").length,
    0
  );

  const propertyStats = Object.entries(groupedData).map(
    ([propertyId, propertyData]) => ({
      id: propertyId,
      name: propertyData.property.name,
      totalPayments: propertyData.payments.length,
      totalAmount: propertyData.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      ),
      pendingPayments: propertyData.payments.filter(
        (p) => p.status === "PENDING"
      ).length,
      overduePayments: propertyData.payments.filter(
        (p) => p.status === "OVERDUE"
      ).length,
    })
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage payments across all properties
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3">
          <Card className="min-w-[90px] p-0 border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-blue-600">
                {totalPayments}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Total Payments
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-[120px] p-0 border-l-4 border-l-green-500">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-green-600 break-words">
                {formatCurrency(totalAmount)}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Total Amount
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] p-0 border-l-4 border-l-yellow-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-yellow-600">
                {pendingPayments}
              </div>
              <div className="text-xs text-gray-500 font-medium">Pending</div>
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
                  (acc, property) => acc + property.payments.length,
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
                  {property.totalPayments}
                </Badge>
                {property.overduePayments > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    {property.overduePayments} overdue
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as PaymentStatus | "ALL")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(
                  value as "dueDate" | "amount" | "status" | "createdAt"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
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
                  {propertyData.payments.length} payments
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
                        Tenant
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Payment Details
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Lot/Spot
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyData.payments.map((payment, index) => (
                      <tr
                        key={payment.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors duration-200`}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">
                              {payment.tenant.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {payment.tenant.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.tenant.phoneNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Receipt className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-mono text-blue-600">
                                {payment.receiptNumber}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 max-w-xs truncate">
                              {payment.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-blue-600">
                              {payment.spot.spotNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">
                              {formatCurrency(payment.amount)}
                            </div>
                            {payment.lateFeeAmount > 0 && (
                              <div className="text-xs text-red-600">
                                +{formatCurrency(payment.lateFeeAmount)} late
                                fee
                              </div>
                            )}
                            <div className="text-sm text-green-600 font-medium">
                              Total: {formatCurrency(payment.totalAmount)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {formatDate(payment.dueDate)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariant[payment.status]}>
                            {statusLabels[payment.status]}
                          </Badge>
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
              No payments found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
