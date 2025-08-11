import { getTenant } from "@/app/apiClient/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  FileText,
  Home,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Settings,
  Shield,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import HelpSection from "../(components)/HelpSection";
import AmenitiesList from "./components/AmenitiesList";
import EditProfileModal from "./components/EditProfileModal";
import { OpenEditProfileTrigger } from "./components/OpenEditProfileTrigger";

export default async function MyInfo() {
  // two‐step, null‐safe
  const res = await getTenant(); // res: ApiResponse<ITenantApiResponse>

  // Handle API errors gracefully
  if (!res.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto p-6 space-y-8">
          {/* Header Section */}
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

          {/* Error Information Card */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
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
          {/* Header Section */}
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

          {/* Account Status Card */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
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

  const tenantData = res.data.user; // ITenant
  const propertyData = res.data.property;
  const spotData = res.data.spot;
  const { length, width } = spotData.size;

  const { daily, weekly, monthly } = spotData.price;

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

  // Mock data - in a real app, this would come from API calls
  const tenantInfo = {
    personal: {
      name: "John Doe",
      phone: "(123) 456-7890",
      email: "john@example.com",
      emergencyContact: "Jane Doe - (987) 654-3210",
    },
    address: {
      street: "1234 Elm Street",
      lot: "Lot 5B",
      city: "Adamsville",
      state: "AL",
      zip: "35005",
      property: "Beck Row RV Park",
    },
    lease: {
      start: "January 1, 2025",
      end: "December 31, 2025",
      rent: "$550.00",
      deposit: "$800.00",
      occupants: "2 Adults, 1 Child",
      pets: "1 Puppy, 1 Cat",
    },
    rv: {
      type: "Fifth Wheel",
      licensePlate: "7XYZ123",
      length: "36 feet",
      slideOuts: "2",
    },
    hookups: {
      water: "Yes",
      electric: "50 AMP",
      sewer: "Yes",
      wifi: "Included",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <User className="w-12 h-12 text-white" />
            </div>
            {/* <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div> */}
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              My Information
            </h1>
            <p className="text-slate-600 mt-3 text-lg max-w-2xl mx-auto">
              Complete tenant profile, lease details, and site information for
              your RV park stay
            </p>
          </div>
          <div className="flex justify-center gap-4">
            {/* <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white !px-8">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button> */}
            {/* 2️⃣ Swap out the old Button */}
            <EditProfileModal tenant={tenantData} tenantInfo={tenantInfo} />
            <Button
              variant="outline"
              className="border-slate-300 bg-slate-200 hover:bg-slate-50 !px-8"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download Lease
            </Button>
          </div>
        </div>

        {/* Account Status Banner */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Account Status: Active
                  </h3>
                  <p className="text-green-100">
                    Your account is in good standing
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 text-sm px-4 py-2"
              >
                <Star className="w-3 h-3 mr-1" />
                Verified Tenant
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Personal & Contact */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <User className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                        Name
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {tenantData?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-500" />
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
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Email Address
                      </p>
                      <p className="font-semibold text-gray-900">
                        {tenantData?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    {/* other profile buttons */}
                    <OpenEditProfileTrigger />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Site Address */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  Tenant Address
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <Home className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">
                        Street Address
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {propertyData?.address?.street}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        ZIP Code
                      </p>
                      <Badge
                        variant="secondary"
                        className="font-bold text-lg px-3 py-1"
                      >
                        {propertyData?.address?.zip || "Not provided"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-2">
                      Full Address
                    </p>
                    <p className="font-semibold text-blue-900 text-lg leading-relaxed">
                      {propertyData?.address?.street || "Not provided"}
                      <br />
                      {propertyData?.address?.city || "Not provided"},{" "}
                      {propertyData?.address?.state || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Lease & RV */}
          <div className="space-y-6">
            {/* Lease Details */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  Lease Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <div className="flex-1">
                      <p className="text-xs text-purple-600 uppercase tracking-wider font-semibold">
                        Lease Period
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {tenantInfo.lease.start} - {tenantInfo.lease.end}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                          Monthly Rent
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                          {tenantInfo.lease.rent}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                          Security Deposit
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                          {tenantInfo.lease.deposit}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                          Occupants
                        </p>
                        <p className="font-semibold text-gray-900">
                          {tenantInfo.lease.occupants}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <PawPrint className="w-5 h-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                          Pets
                        </p>
                        <p className="font-semibold text-gray-900">
                          {tenantInfo.lease.pets}
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {/* RV Information */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Home className="w-5 h-5 text-amber-600" />
                  </div>
                  RV Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                    <Home className="w-5 h-5 text-amber-500" />
                    <div className="flex-1">
                      <p className="text-xs text-amber-600 uppercase tracking-wider font-semibold">
                        RV and Lot
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {propertyData?.name || "Not Listed"} ,{" "}
                        {spotData?.spotNumber || "Not Lot"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {/* Size Row */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Dimensions
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dimensions.map(([label, val]) => (
                          <div
                            key={label}
                            className="p-4 bg-gray-50 rounded-xl"
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

                    {/* Price Row */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Pricing
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(nonZeroRates.length ? nonZeroRates : rates).map(
                          ([label, amount]) => (
                            <div
                              key={label}
                              className="p-4 bg-gray-50 rounded-xl"
                            >
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                                {label}
                              </p>
                              <p className="font-bold text-gray-900 text-lg">
                                {amount > 0 ? `$${amount}` : "—"}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {dimensions.map(([label, val]) => (
                        <div key={label} className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                            {label}
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {val > 0 ? `${val} ft` : "0 ft"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(nonZeroRates.length ? nonZeroRates : rates).map(
                        ([label, amount]) => (
                          <div
                            key={label}
                            className="p-4 bg-gray-50 rounded-xl"
                          >
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                              {label}
                            </p>
                            <p className="font-bold text-gray-900 text-lg">
                              {amount > 0 ? `$${amount}` : "—"}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div> */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                      Rules
                    </p>
                    <p className="font-bold text-gray-900 text-lg">
                      {propertyData?.rules || "No specific rules listed"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Tenant Details */}
          </div>

          {/* Right Column - Hookups & Actions */}
          <div className="space-y-6">
            {/* Site Hookups & Amenities */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-indigo-600" />
                  </div>
                  Site Amenities
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <AmenitiesList amenities={spotData?.amenities} />
                {/* <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Droplets className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-green-900 text-lg">Water</p>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 font-semibold"
                      >
                        {tenantInfo.hookups.water}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    {(() => {
                      const val = tenantInfo.hookups.electric;
                      const is50 = val === "50 AMP";

                      return (
                        <div
                          className={`flex items-center gap-4 p-4 rounded-xl border ${
                            is50
                              ? "bg-gradient-to-r from-red-50 to-red-100 border-red-100"
                              : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100"
                          }`}
                        >
                          
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              is50 ? "bg-red-100" : "bg-blue-100"
                            }`}
                          >
                            {is50 ? (
                              <div className="flex items-center">
                                <BatteryCharging className="w-6 h-6 text-red-600 -mr-1" />
                                <Zap className="w-5 h-5 text-red-600" />
                              </div>
                            ) : (
                              <Zap className="w-6 h-6 text-blue-600" />
                            )}
                          </div>

                          
                          <div className="flex-1">
                            <p
                              className={`font-bold text-lg ${
                                is50 ? "text-red-900" : "text-blue-900"
                              }`}
                            >
                              Electric
                            </p>
                            <Badge
                              variant="secondary"
                              className={`font-semibold ${
                                is50
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {val}
                            </Badge>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Settings className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-purple-900 text-lg">Sewer</p>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 font-semibold"
                      >
                        {tenantInfo.hookups.sewer}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Wifi className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-orange-900 text-lg">WiFi</p>
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800 font-semibold"
                      >
                        {tenantInfo.hookups.wifi}
                      </Badge>
                    </div>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardHeader className="pb-4">
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
                  <FileText className="w-4 h-4 mr-3" />
                  Download Lease
                </Button>
                <Link href="tel:+1234567890" passHref className="block ">
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12"
                  >
                    <Phone className="w-4 h-4 mr-3" />
                    Contact Office
                  </Button>
                </Link>

                <Link href="/support" className="block ">
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
