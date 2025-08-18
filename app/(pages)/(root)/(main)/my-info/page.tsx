import { getTenant } from "@/app/apiClient/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  Building,
  Calendar,
  Car,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Hash,
  Home,
  Key,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Ruler,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import AccountStatusBanner from "../(components)/AccountStatusBanner";
import HelpSection from "../(components)/HelpSection";
import AmenitiesList from "./components/AmenitiesList";
import EditProfileModal from "./components/EditProfileModal";
import { OpenEditProfileTrigger } from "./components/OpenEditProfileTrigger";

export default async function MyInfo() {
  const res = await getTenant();
  console.log("🚀 ~ res:", res);

  if (!res.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto p-6 space-y-8">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Information Unavailable
              </h1>
              <p className="text-slate-600 mt-3 text-lg max-w-2xl mx-auto">
                We're experiencing technical difficulties loading your
                information
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="!pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-slate-600" />
                  </div>
                  What Happened?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Technical Issue
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {res.error === "NETWORK_ERROR"
                        ? "The connection to our servers was interrupted. This is usually temporary."
                        : "We encountered an unexpected error while retrieving your data."}
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">
                      What You Can Do
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li>• Check your internet connection</li>
                      <li>• Try refreshing the page</li>
                      <li>• Contact support if the issue persists</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <Link href="/my-info">
                    <Button className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-lg text-white">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!res.data?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto p-6 space-y-8">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Account Not Found
              </h1>
              <p className="text-slate-600 mt-3 text-lg max-w-2xl mx-auto">
                We couldn't locate your account information
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="!pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Possible Reasons
                    </h3>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• Your session may have expired</li>
                      <li>• Account might need verification</li>
                      <li>• You may need to log in again</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">
                      Next Steps
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li>• Try refreshing the page</li>
                      <li>• Log out and log back in</li>
                      <li>• Contact the office for assistance</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <Link href="/my-info">
                    <Button className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-lg text-white">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Page
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Office
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const tenantData = res.data.user;
  const propertyData = res.data.property;
  const spotData = res.data.spot;
  const leaseData = res.data.lease;
  const rentData = res.data.rent;

  const sizeData =
    typeof spotData.size === "string" ? { length: 0, width: 0 } : spotData.size;
  const { length, width } = sizeData;

  const priceData =
    typeof spotData.price === "number"
      ? { daily: 0, weekly: 0, monthly: spotData.price }
      : spotData.price;
  const { daily, weekly, monthly } = priceData;

  console.log("data", spotData, propertyData);

  const rates: [string, number][] = [
    ["Daily", daily],
    ["Weekly", weekly],
    ["Monthly", monthly],
  ];

  const dimensions: [string, number][] = [
    ["Length", length],
    ["Width", width],
  ];

  const nonZeroRates = rates.filter(([, amount]) => amount > 0);

  if (!tenantData) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center">User Not Found</h1>
        <p className="text-center text-gray-600 mt-2">
          Please check your account or contact support.
        </p>
      </div>
    );
  }

  const emergencyContactText = leaseData?.emergencyContact
    ? `${leaseData.emergencyContact.name} - ${leaseData.emergencyContact.phone}`
    : "";
  const modalTenantInfo = {
    personal: {
      emergencyContact: emergencyContactText,
    },
    address: {
      property: propertyData?.name ?? "",
      lot: spotData?.spotNumber ?? "",
      street: propertyData?.address?.street ?? "",
      city: propertyData?.address?.city ?? "",
      state: propertyData?.address?.state ?? "",
      zip: propertyData?.address?.zip ?? "",
    },
  };

  const formatCurrency = (amount?: number) =>
    typeof amount === "number"
      ? amount.toLocaleString(undefined, { style: "currency", currency: "USD" })
      : "—";

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : "—";

  const computedLeaseEnd = (() => {
    if (leaseData?.leaseEnd) return formatDate(leaseData.leaseEnd);
    if (leaseData?.leaseStart && typeof leaseData?.durationDays === "number") {
      const start = new Date(leaseData.leaseStart);
      const end = new Date(start);
      end.setDate(end.getDate() + leaseData.durationDays);
      return end.toLocaleDateString();
    }
    return "—";
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white p-8 lg:p-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold">
                      {tenantData.name}
                    </h1>
                    <p className="text-blue-100 text-lg">
                      {propertyData?.name} • Lot {spotData?.spotNumber}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Shield className="w-3 h-3 mr-1" />
                    {leaseData?.leaseStatus || "Unknown Status"}
                  </Badge>

                  <Badge className="bg-white/20 text-white border-white/30">
                    <Clock className="w-3 h-3 mr-1" />
                    Since {formatDate(leaseData?.leaseStart)}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <EditProfileModal
                  tenant={tenantData}
                  tenantInfo={modalTenantInfo}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Lease
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status Banner */}
        {!tenantData.tenantStatus && (
          <AccountStatusBanner
            tenantStatus={tenantData.tenantStatus || false}
            tenantName={tenantData.name}
          />
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-green-100" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Monthly
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2">
                {formatCurrency(
                  leaseData?.rentAmount ?? rentData?.fullMonthRentAmount
                )}
              </div>
              <p className="text-green-100 text-sm">Rent Amount</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Key className="w-8 h-8 text-blue-100" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Deposit
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2">
                {formatCurrency(
                  leaseData?.depositAmount ?? rentData?.depositAmount
                )}
              </div>
              <p className="text-blue-100 text-sm">Security Deposit</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Hash className="w-8 h-8 text-purple-100" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Lot
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2">
                {spotData?.spotNumber || "—"}
              </div>
              <p className="text-purple-100 text-sm">Lot Number</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-amber-100" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Occupants
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2">
                {leaseData?.occupants || "—"}
              </div>
              <p className="text-amber-100 text-sm">People</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="!pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className=" space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                        Full Name
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {tenantData?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Phone Number
                      </p>
                      <p className="font-semibold text-gray-900">
                        {tenantData?.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Email Address
                      </p>
                      <p className="font-semibold text-gray-900">
                        {tenantData?.email}
                      </p>
                    </div>
                  </div>

                  <OpenEditProfileTrigger />
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card className="shadow-lg border-0">
              <CardHeader className="!pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className=" space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">
                        Property Name
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {propertyData?.name || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                        Full Address
                      </p>
                    </div>
                    <p className="font-semibold text-blue-900 text-lg leading-relaxed">
                      {propertyData?.address?.street || "Not provided"}
                      <br />
                      {propertyData?.address?.city || "Not provided"},{" "}
                      {propertyData?.address?.state || "Not provided"}{" "}
                      {propertyData?.address?.zip || ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lease & RV Information */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="!pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Lease Information
                </CardTitle>
              </CardHeader>
              <CardContent className=" space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold">
                        Lease Period
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {formatDate(leaseData?.leaseStart)} - {computedLeaseEnd}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                          Monthly Rent
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                          {formatCurrency(
                            leaseData?.rentAmount ??
                              rentData?.fullMonthRentAmount
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                          Security Deposit
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                          {formatCurrency(
                            leaseData?.depositAmount ?? rentData?.depositAmount
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {leaseData?.occupants && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                          Occupants
                        </p>
                        <p className="font-semibold text-gray-900">
                          {leaseData.occupants} person(s)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="!pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  RV & Lot Details
                </CardTitle>
              </CardHeader>
              <CardContent className=" space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-amber-600 uppercase tracking-wider font-semibold">
                        Current Location
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {propertyData?.name || "Not Listed"} • Lot{" "}
                        {spotData?.spotNumber || "Not Assigned"}
                      </p>
                    </div>
                  </div>

                  {/* RV Details */}
                  {leaseData?.rvInfo && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3 mb-3">
                        <Car className="w-5 h-5 text-blue-600" />
                        <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                          RV Details
                        </p>
                      </div>
                      <p className="font-semibold text-blue-900 text-lg">
                        {leaseData.rvInfo.year} {leaseData.rvInfo.make}{" "}
                        {leaseData.rvInfo.model}
                      </p>
                      <p className="text-sm text-blue-700">
                        Length: {leaseData.rvInfo.length} ft | Plate:{" "}
                        {leaseData.rvInfo.licensePlate}
                      </p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Lot Dimensions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Ruler className="w-5 h-5 text-gray-600" />
                        Lot Dimensions
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dimensions.map(([label, val]) => (
                          <div
                            key={label}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                          >
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                              {label}
                            </p>
                            <p className="font-bold text-gray-900 text-lg">
                              {val > 0 ? `${val} ft` : "0 ft"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {propertyData?.rules?.length && (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <p className="text-xs text-orange-600 uppercase tracking-wider font-semibold">
                          Property Rules
                        </p>
                      </div>
                      <p className="font-semibold text-orange-900">
                        {propertyData.rules.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Amenities & Actions */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="!pb-3 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  Site Amenities
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <AmenitiesList amenities={spotData?.amenities} />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardHeader className="!pb-3 border-b border-gray-100">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"
                >
                  <Download className="w-4 h-4 mr-3" />
                  Download Lease
                </Button>
                <Link href="tel:+1234567890" passHref className="block">
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"
                  >
                    <Phone className="w-4 h-4 mr-3" />
                    Contact Office
                  </Button>
                </Link>
                <Link href="/support" className="block">
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"
                  >
                    <AlertCircle className="w-4 h-4 mr-3" />
                    Report Issue
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Info */}
        <HelpSection
          icon={<Shield className="w-4 h-4 text-gray-600" />}
          title="Secure & Private"
          description="Your information is securely stored and only accessible to authorized personnel."
          phone="(555) 555-0000"
          hours="All changes to your profile will be reviewed and approved by management. For immediate assistance, contact the office at (555) 555-0000."
          className="shadow-lg border-0 bg-white/90 backdrop-blur-sm"
        />
      </div>
    </div>
  );
}
