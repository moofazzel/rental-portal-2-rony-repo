import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPropertyFull, ISpot } from "@/types/properties.type";
import {
  Building2,
  CheckCircle2,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import AddLotModal from "./AddLotModal";
import DeletePropertyModal from "./DeletePropertyModal";
import ImageModal from "./ImageModal";
import PropertyNoticesAndDocuments from "./PropertyNoticesAndDocuments";
import UpdatePropertyModal from "./UpdatePropertyModal";

export default function PropertyDetailsCard({
  propertyDetails,
  spots,
}: {
  propertyDetails: IPropertyFull;
  spots: ISpot[];
}) {
  const {
    name,
    description,
    amenities,
    rules,
    // totalLots,
    // availableLots,
    isActive,
    address,
    identifierType,
    createdAt,
    updatedAt,
  } = propertyDetails;

  // Calculate occupancy based on property data
  const totalLotsValue = propertyDetails.totalSpots || 0;
  const availableLotsValue = propertyDetails.availableSpots || 0;
  const occupiedLots = totalLotsValue - availableLotsValue;

  // const getOccupancyRate = () => {
  //   if (!totalLots || totalLots === 0) return 0;
  //   return Math.round((occupiedLots / totalLots) * 100);
  // };
  const getOccupancyRate = () => {
    if (!totalLotsValue || totalLotsValue === 0) return 0;

    const safeOccupied = Math.max(0, Math.min(occupiedLots, totalLotsValue));
    return Math.round((safeOccupied / totalLotsValue) * 100);
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return "text-red-600 bg-red-50";
    if (rate >= 75) return "text-orange-600 bg-orange-50";
    if (rate >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const getIdentifierTypeDisplay = (type: string) => {
    return type === "lotNumber" ? "Lot Number" : "Road Number";
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <ImageModal
            images={propertyDetails.images || []}
            propertyName={propertyDetails.name}
          />

          <div className="flex-1 space-y-4">
            {/* Status and Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={`w-fit ${
                  isActive
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {isActive ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1.5" />
                    Active Property
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1.5" />
                    Inactive Property
                  </>
                )}
              </Badge>
              <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Created{" "}
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Updated{" "}
                  {updatedAt
                    ? new Date(updatedAt).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
            </div>

            {/* Property Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {name}
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>

            {/* Description */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <p className="text-gray-700 leading-relaxed text-sm">
                {description}
              </p>
            </div>

            {/* Address */}
            <div className="flex items-center gap-3 text-gray-600 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-100">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Property Location
                </p>
                <p className="text-sm text-gray-600">
                  {address.street}, {address.city}, {address.state}{" "}
                  {address.zip}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-yellow-100 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                Available Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {(amenities || []).map((amenity, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 text-xs px-3 py-1.5 font-medium hover:shadow-sm transition-shadow"
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 lg:min-w-[280px]">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Quick Actions
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Update Property */}

                <UpdatePropertyModal property={propertyDetails} />

                {/* Add New Lot */}

                <AddLotModal
                  propertyId={propertyDetails._id as string}
                  amenities={propertyDetails.amenities || []}
                  address={{
                    street: propertyDetails.address.street,
                    city: propertyDetails.address.city,
                    state: propertyDetails.address.state || "",
                    zip: propertyDetails.address.zip,
                    country: propertyDetails.address.country || "",
                  }}
                  identifierType={propertyDetails.identifierType || "lotNumber"}
                />

                {/* Delete Property */}

                <DeletePropertyModal property={propertyDetails} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Property Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold text-blue-50">
                Total Lots
              </CardTitle>
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building2 className="h-5 w-5 text-blue-100" />
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-3xl font-bold mb-2">{totalLotsValue}</div>
              <p className="text-sm text-blue-100 font-medium leading-relaxed">
                {occupiedLots} occupied units
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold text-emerald-50">
                Occupancy Rate
              </CardTitle>
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-emerald-100" />
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-3xl font-bold mb-2">
                {getOccupancyRate()}%
              </div>
              <p className="text-sm text-emerald-100 font-medium leading-relaxed">
                {availableLotsValue} available units
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold text-purple-50">
                Active Tenants
              </CardTitle>
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-5 w-5 text-purple-100" />
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-3xl font-bold mb-2">{occupiedLots}</div>
              <p className="text-sm text-purple-100 font-medium leading-relaxed">
                {availableLotsValue} available units
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold text-amber-50">
                Monthly Revenue
              </CardTitle>
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="h-5 w-5 text-amber-100" />
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-3xl font-bold mb-2">
                $
                {(
                  propertyDetails.totalCurrentActiveIncome || 0
                ).toLocaleString()}
              </div>
              <p className="text-sm text-amber-100 font-medium leading-relaxed">
                ${(propertyDetails.totalMaxIncome || 0).toLocaleString()} max
                revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">
              Occupancy Progress
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${getOccupancyColor(
                getOccupancyRate()
              )}`}
            >
              {getOccupancyRate()}% Full
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                getOccupancyRate() >= 90
                  ? "bg-red-500"
                  : getOccupancyRate() >= 75
                  ? "bg-orange-500"
                  : getOccupancyRate() >= 50
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${getOccupancyRate()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lot Identification Type */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Hash className="h-4 w-4 text-indigo-500" />
          Lot Identification
        </h2>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200"
          >
            {getIdentifierTypeDisplay(identifierType || "lotNumber")}
          </Badge>
          <span className="text-sm text-gray-600">
            Lots are identified by{" "}
            {identifierType === "roadNumber" ? "road numbers" : "lot numbers"}
          </span>
        </div>
      </div> */}

      {/* Rules */}
      {rules && rules.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-gray-500" />
            Rules & Policies
          </h2>
          <ul className="space-y-1">
            {rules.map((rule, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-gray-700 text-sm"
              >
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Property Notices and Documents */}
      <PropertyNoticesAndDocuments property={propertyDetails} />
    </div>
  );
}
