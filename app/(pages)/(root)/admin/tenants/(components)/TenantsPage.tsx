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
import { ITenant } from "@/types/tenant.types";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Filter,
  LockIcon,
  MapPin,
  Phone,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const TenantEditModal = dynamic(() => import("./TenantEditModal"), {
  ssr: false,
});

const PaymentButton = dynamic(() => import("./TenantPaymentModal"), {
  ssr: false,
});

const InviteTenantModal = dynamic(() => import("./InviteTenantModal"), {
  ssr: false,
});

interface TenantsPageProps {
  tenants: ITenant[];
}

interface GroupedTenants {
  [propertyId: string]: {
    property: {
      _id: string;
      name: string;
      address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
    };
    tenants: ITenant[];
  };
}

export default function TenantsPage({ tenants }: TenantsPageProps) {
  const [groupedData, setGroupedData] = useState<GroupedTenants>({});
  const [filteredData, setFilteredData] = useState<GroupedTenants>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");

  // Use the tenantStatus from API instead of calculating locally
  const isTenantProfileComplete = (tenant: ITenant): boolean => {
    return tenant.tenantStatus === true;
  };

  // Function to get missing fields for debugging (simplified since we use API tenantStatus)
  const getMissingFields = (tenant: ITenant): string[] => {
    const missingFields: string[] = [];

    // Check basic information
    if (!tenant.name) missingFields.push("Name");
    if (!tenant.email) missingFields.push("Email");
    if (!tenant.phoneNumber) missingFields.push("Phone Number");

    // Check RV information
    if (!tenant.rvInfo?.make) missingFields.push("RV Make");
    if (!tenant.rvInfo?.model) missingFields.push("RV Model");
    if (!tenant.rvInfo?.year) missingFields.push("RV Year");
    if (!tenant.rvInfo?.length) missingFields.push("RV Length");
    if (!tenant.rvInfo?.licensePlate) missingFields.push("RV License Plate");

    // Check lot information
    if (
      !tenant.lotNumber &&
      !(
        tenant.spot &&
        typeof tenant.spot === "object" &&
        tenant.spot.spotNumber
      )
    ) {
      missingFields.push("Lot/Spot Number");
    }

    // Check property information
    if (
      !tenant.property ||
      (typeof tenant.property === "object" && !tenant.property.name)
    ) {
      missingFields.push("Property Assignment");
    }

    // Check lease information
    if (!tenant.lease?.leaseType) missingFields.push("Lease Type");
    if (!tenant.lease?.leaseStart) missingFields.push("Lease Start Date");
    if (!tenant.lease?.rentAmount) missingFields.push("Rent Amount");
    if (!tenant.lease?.depositAmount) missingFields.push("Security Deposit");
    if (!tenant.lease?.occupants) missingFields.push("Number of Occupants");

    // Check lease end date for fixed term leases
    if (
      tenant.lease?.leaseType?.toLowerCase() === "fixed" &&
      !tenant.lease?.leaseEnd
    ) {
      missingFields.push("Lease End Date");
    }

    return missingFields;
  };

  // Function to get row background color based on verification status
  const getRowBackgroundColor = (tenant: ITenant, index: number): string => {
    const isVerified = isTenantProfileComplete(tenant);

    if (isVerified) {
      return "bg-green-50 hover:bg-green-100"; // Green for verified tenants
    } else {
      return index % 2 === 0
        ? "bg-yellow-50 hover:bg-yellow-100"
        : "bg-yellow-100 hover:bg-yellow-200"; // Yellow for unverified tenants
    }
  };
  const [leaseFilter, setLeaseFilter] = useState<"all" | "monthly" | "fixed">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"name" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [selectedTenant, setSelectedTenant] = useState<ITenant | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [lastClickedSource, setLastClickedSource] = useState<
    "row" | "payment" | null
  >(null);

  // Group tenants by property
  useMemo(() => {
    const grouped = tenants.reduce((acc, tenant) => {
      // Handle different property data structures
      if (tenant.property) {
        if (
          typeof tenant.property === "object" &&
          (tenant.property._id || tenant.property.id)
        ) {
          // Property is populated object
          const propertyId =
            tenant.property._id || tenant.property.id || "unknown-property";
          if (!acc[propertyId]) {
            acc[propertyId] = {
              property: {
                _id: propertyId,
                name: tenant.property.name,
                address: tenant.property.address || {
                  street: "Address not loaded",
                  city: "Unknown",
                  state: "Unknown",
                  zip: "00000",
                  country: "Unknown",
                },
              },
              tenants: [],
            };
          }
          acc[propertyId].tenants.push(tenant);
        } else if (typeof tenant.property === "string") {
          // Property is a string ID reference
          const propertyId = tenant.property;
          if (!acc[propertyId]) {
            acc[propertyId] = {
              property: {
                _id: propertyId,
                name: `Property ${propertyId}`,
                address: {
                  street: "Address not loaded",
                  city: "Unknown",
                  state: "Unknown",
                  zip: "00000",
                  country: "Unknown",
                },
              },
              tenants: [],
            };
          }
          acc[propertyId].tenants.push(tenant);
        } else {
          // Invalid property data
          const noPropertyId = "invalid-property";
          if (!acc[noPropertyId]) {
            acc[noPropertyId] = {
              property: {
                _id: noPropertyId,
                name: "Invalid Property Data",
                address: {
                  street: "No Address",
                  city: "Unknown",
                  state: "Unknown",
                  zip: "00000",
                  country: "Unknown",
                },
              },
              tenants: [],
            };
          }
          acc[noPropertyId].tenants.push(tenant);
        }
      } else {
        // Handle tenants without property assignment
        const noPropertyId = "no-property";
        if (!acc[noPropertyId]) {
          acc[noPropertyId] = {
            property: {
              _id: noPropertyId,
              name: "Unassigned",
              address: {
                street: "No Address",
                city: "Unknown",
                state: "Unknown",
                zip: "00000",
                country: "Unknown",
              },
            },
            tenants: [],
          };
        }
        acc[noPropertyId].tenants.push(tenant);
      }
      return acc;
    }, {} as GroupedTenants);

    setGroupedData(grouped);
  }, [tenants]);

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
      }, {} as GroupedTenants);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredTenants = property.tenants.filter(
          (tenant) =>
            tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.phoneNumber
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (tenant.lotNumber &&
              tenant.lotNumber
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (tenant.lease?.leaseType &&
              tenant.lease.leaseType
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (tenant.leaseType &&
              tenant.leaseType
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (tenant.lease?.rentAmount &&
              tenant.lease.rentAmount.toString().includes(searchTerm)) ||
            (tenant.rent &&
              tenant.rent.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (filteredTenants.length > 0) {
          acc[propertyId] = {
            ...property,
            tenants: filteredTenants,
          };
        }
        return acc;
      }, {} as GroupedTenants);
    }

    // Filter by verification status
    if (statusFilter !== "all") {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredTenants = property.tenants.filter((tenant) => {
          if (statusFilter === "verified")
            return isTenantProfileComplete(tenant);
          if (statusFilter === "unverified")
            return !isTenantProfileComplete(tenant);
          return true;
        });

        if (filteredTenants.length > 0) {
          acc[propertyId] = {
            ...property,
            tenants: filteredTenants,
          };
        }
        return acc;
      }, {} as GroupedTenants);
    }

    // Filter by lease type
    if (leaseFilter !== "all") {
      filtered = Object.keys(filtered).reduce((acc, propertyId) => {
        const property = filtered[propertyId];
        const filteredTenants = property.tenants.filter((tenant) => {
          const tenantLeaseType =
            tenant.lease?.leaseType?.toLowerCase() ||
            tenant.leaseType?.toLowerCase();
          if (leaseFilter === "monthly") return tenantLeaseType === "monthly";
          if (leaseFilter === "fixed") return tenantLeaseType === "fixed";
          return true;
        });

        if (filteredTenants.length > 0) {
          acc[propertyId] = {
            ...property,
            tenants: filteredTenants,
          };
        }
        return acc;
      }, {} as GroupedTenants);
    }

    // Sort tenants within each property
    Object.keys(filtered).forEach((propertyId) => {
      filtered[propertyId].tenants.sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortBy === "status") {
          const aStatus = a.tenantStatus ? 1 : 0;
          const bStatus = b.tenantStatus ? 1 : 0;
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
    leaseFilter,
    sortBy,
    sortOrder,
    selectedProperty,
  ]);

  const getStatusIcon = (isVerified: boolean) => {
    return isVerified ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  // Function to get rent status based on payment data
  const getRentStatus = (
    tenant: ITenant
  ): { status: string; color: string; badgeColor: string } => {
    // Use the new paymentStatus from the tenant data
    if (tenant.paymentStatus) {
      const { currentStatus } = tenant.paymentStatus;

      switch (currentStatus) {
        case "NO_PAYMENTS":
          return {
            status: "Due",
            color: "text-red-600",
            badgeColor: "bg-red-100 text-red-800 border-red-200",
          };
        case "CURRENT":
          return {
            status: "Current",
            color: "text-green-600",
            badgeColor: "bg-green-100 text-green-800 border-green-200",
          };
        case "DUE":
          return {
            status: "Due",
            color: "text-yellow-600",
            badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
          };
        case "OVERDUE":
          return {
            status: "Overdue",
            color: "text-red-600",
            badgeColor: "bg-red-100 text-red-800 border-red-200",
          };
        default:
          return {
            status: "Due",
            color: "text-yellow-600",
            badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
          };
      }
    }

    // Fallback to old logic if paymentStatus is not available
    if (
      tenant.payments?.pending &&
      Array.isArray(tenant.payments.pending) &&
      tenant.payments.pending.length > 0
    ) {
      return {
        status: "Due",
        color: "text-yellow-600",
        badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    }

    return {
      status: "Current",
      color: "text-green-600",
      badgeColor: "bg-green-100 text-green-800 border-green-200",
    };
  };

  // Function to check if this is the first payment
  const isFirstPayment = (tenant: ITenant): boolean => {
    return Boolean(
      tenant.paymentStatus?.currentStatus === "NO_PAYMENTS" ||
        (tenant.paymentStatus?.paymentHistory &&
          tenant.paymentStatus.paymentHistory.length === 0)
    );
  };

  const totalTenants = Object.values(filteredData).reduce(
    (acc, property) => acc + property.tenants.length,
    0
  );
  const verifiedTenants = Object.values(filteredData).reduce(
    (acc, property) =>
      acc + property.tenants.filter((t) => isTenantProfileComplete(t)).length,
    0
  );
  const unverifiedTenants = Object.values(filteredData).reduce(
    (acc, property) =>
      acc + property.tenants.filter((t) => !isTenantProfileComplete(t)).length,
    0
  );

  const propertyStats = Object.entries(groupedData).map(
    ([propertyId, propertyData]) => ({
      id: propertyId,
      name: propertyData.property.name,
      totalTenants: propertyData.tenants.length,
      verifiedTenants: propertyData.tenants.filter((t) =>
        isTenantProfileComplete(t)
      ).length,
      unverifiedTenants: propertyData.tenants.filter(
        (t) => !isTenantProfileComplete(t)
      ).length,
    })
  );

  const handleRowClick = (tenant: ITenant, e: React.MouseEvent) => {
    // Don't open edit modal if the last click was from payment button
    if (lastClickedSource === "payment") {
      setLastClickedSource(null);
      return;
    }

    e.stopPropagation();
    setLastClickedSource("row");
    setSelectedTenant(tenant);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tenants Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track tenants across all properties
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3">
          <Card className="min-w-[90px] p-0 border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-blue-600">
                {totalTenants}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Total Tenants
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] p-0 border-l-4 border-l-green-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-green-600">
                {verifiedTenants}
              </div>
              <div className="text-xs text-gray-500 font-medium">Verified</div>
            </CardContent>
          </Card>
          <Card className="min-w-[90px] p-0 border-l-4 border-l-red-500">
            <CardContent className="p-3">
              <div className="text-xl font-bold text-red-600">
                {unverifiedTenants}
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
          <InviteTenantModal />
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
                  (acc, property) => acc + property.tenants.length,
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
                  {property.totalTenants}
                </Badge>
                {property.unverifiedTenants > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    {property.unverifiedTenants} pending
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
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | "verified" | "unverified")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={leaseFilter}
              onValueChange={(value) =>
                setLeaseFilter(value as "all" | "monthly" | "fixed")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by lease type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lease Types</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="fixed">Fixed Term</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as "name" | "status")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
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
                  {propertyData.tenants.length} tenants
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
                        Account
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Lot/Spot
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Lease Info
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Rent Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyData.tenants.map((tenant, index) => (
                      <tr
                        key={tenant._id}
                        className={`${getRowBackgroundColor(
                          tenant,
                          index
                        )} transition-colors duration-200 cursor-pointer`}
                        onClick={(e) => handleRowClick(tenant, e)}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">
                              {tenant.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {tenant.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tenant.isVerified || false)}
                            <div className="relative group">
                              <Badge
                                className={getStatusColor(
                                  tenant.isVerified || false
                                )}
                              >
                                {tenant.isVerified ? "Verified" : "Pending"}
                              </Badge>
                              {!tenant.tenantStatus && (
                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-2 w-64 z-10">
                                  <div className="font-medium mb-1">
                                    Missing Fields:
                                  </div>
                                  <div className="space-y-1">
                                    {getMissingFields(tenant)
                                      .slice(0, 5)
                                      .map((field, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-1"
                                        >
                                          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                          {field}
                                        </div>
                                      ))}
                                    {getMissingFields(tenant).length > 5 && (
                                      <div className="text-gray-300 text-xs">
                                        +{getMissingFields(tenant).length - 5}{" "}
                                        more fields
                                      </div>
                                    )}
                                  </div>
                                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {tenant.phoneNumber || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-blue-600">
                              {tenant.lotNumber ||
                                (tenant.spot && typeof tenant.spot === "object"
                                  ? tenant.spot.spotNumber
                                  : "N/A")}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-500">
                                Type:
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {tenant.lease?.leaseType ||
                                  tenant.leaseType ||
                                  "N/A"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-500">
                                Rent:
                              </span>
                              <span className="text-xs text-green-600 font-medium">
                                $
                                {tenant.lease?.rentAmount ||
                                  tenant.lotPrice?.monthly ||
                                  tenant.rent ||
                                  "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-500">
                                Occupants:
                              </span>
                              <span className="text-xs text-blue-600">
                                {tenant.lease?.occupants ||
                                  tenant.occupants ||
                                  "N/A"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getRentStatus(tenant).badgeColor}>
                              {getRentStatus(tenant).status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {tenant.tenantStatus ? (
                              <PaymentButton
                                tenant={tenant}
                                isFirstPayment={isFirstPayment(tenant)}
                                onPaymentClick={() =>
                                  setLastClickedSource("payment")
                                }
                              />
                            ) : (
                              <button
                                type="button"
                                className="flex items-center gap-1 text-sm text-gray-400 italic cursor-not-allowed bg-gray-100 px-2 py-1 rounded opacity-70"
                                disabled
                                title="Payment unavailable"
                              >
                                <LockIcon className="w-4 h-4" />
                                Payment
                              </button>
                            )}
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
              No tenants found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      {selectedTenant && lastClickedSource === "row" && (
        <TenantEditModal
          tenant={selectedTenant}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}
    </div>
  );
}
