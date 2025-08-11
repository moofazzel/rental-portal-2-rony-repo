// app/admin/property/(components)/PropertyDetailsCard.tsx

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IPropertyFull } from "@/types/properties.type";
import {
  Calendar,
  CheckCircle2,
  Home,
  MapPin,
  Star,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import AddLotModal from "./AddLotModal";
import DeletePropertyModal from "./DeletePropertyModal";
import UpdatePropertyModal from "./UpdatePropertyModal";

export default function PropertyDetailsCard({
  propertyDetails,
}: {
  propertyDetails: IPropertyFull;
}) {
  const {
    name,
    description,
    amenities,
    rules,
    totalLots,
    availableLots,
    isActive,
    address,
    createdAt,
    updatedAt,
  } = propertyDetails;

  // Calculate occupied lots
  const occupiedLots = totalLots - (availableLots || 0);

  // const getOccupancyRate = () => {
  //   if (!totalLots || totalLots === 0) return 0;
  //   return Math.round((occupiedLots / totalLots) * 100);
  // };
  const getOccupancyRate = () => {
    if (!totalLots || totalLots === 0) return 0;

    const available = availableLots ?? 0; // use 0 if undefined

    const occupied =
      typeof occupiedLots === "number" ? occupiedLots : totalLots - available;

    const safeOccupied = Math.max(0, Math.min(occupied, totalLots));
    return Math.round((safeOccupied / totalLots) * 100);
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return "text-red-600 bg-red-50";
    if (rate >= 75) return "text-orange-600 bg-orange-50";
    if (rate >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={`${
                  isActive
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {isActive ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Inactive
                  </>
                )}
              </Badge>
              <span className="text-sm text-gray-500">
                Created{" "}
                {createdAt
                  ? new Date(createdAt).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {address.street}, {address.city}, {address.state} {address.zip}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Delete Property modal */}
            <DeletePropertyModal property={propertyDetails} />
            <UpdatePropertyModal property={propertyDetails} />
            <AddLotModal
              propertyId={propertyDetails.id || ""}
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
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Property Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600">
                    Total Lots
                  </p>
                  <p className="text-xl font-bold text-blue-900">{totalLots}</p>
                </div>
                <div className="p-1.5 bg-blue-200 rounded-lg">
                  <Home className="h-4 w-4 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600">
                    Available
                  </p>
                  <p className="text-xl font-bold text-green-900">
                    {availableLots}
                  </p>
                </div>
                <div className="p-1.5 bg-green-200 rounded-lg">
                  <Users className="h-4 w-4 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-600">
                    Occupied
                  </p>
                  <p className="text-xl font-bold text-purple-900">
                    {occupiedLots}
                  </p>
                </div>
                <div className="p-1.5 bg-purple-200 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-orange-600">
                    Occupancy Rate
                  </p>
                  <p className="text-xl font-bold text-orange-900">
                    {getOccupancyRate()}%
                  </p>
                </div>
                <div className="p-1.5 bg-orange-200 rounded-lg">
                  <div className="h-4 w-4 bg-orange-700 rounded-full" />
                </div>
              </div>
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

      {/* Description and Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm">{description}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            Address
          </h2>
          <div className="space-y-1 text-gray-700 text-sm">
            <p className="font-medium">{address.street}</p>
            <p>
              {address.city}, {address.state} {address.zip}
            </p>
            <p>{address.country}</p>
          </div>
        </div>
      </div>

      {/* Amenities and Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Amenities
          </h2>
          <div className="flex flex-wrap gap-1">
            {(amenities || []).map((amenity, i) => (
              <Badge
                key={i}
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
              >
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

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
      </div>

      {/* Last Updated */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-xs text-gray-600">
          <p>
            Last Updated:{" "}
            {updatedAt ? new Date(updatedAt).toLocaleString() : "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
