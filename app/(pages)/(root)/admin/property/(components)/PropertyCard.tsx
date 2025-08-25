"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IProperty } from "@/types/properties.type";
import { Home, MapPin, Star, Users } from "lucide-react";
import Link from "next/link";

interface PropertyCardProps {
  property?: IProperty;
}

export function PropertyCard({ property }: PropertyCardProps) {
  // console.log("PropertyCard rendered with property:", property);

  // const getOccupancyRate = () => {
  //   if (!property?.totalLots || property.totalLots === 0) return 0;
  //   const occupied = property.totalLots - (property.availableLots || 0);
  //   return Math.round((occupied / property.totalLots) * 100);
  // };

  // const getOccupancyColor = (rate: number) => {
  //   if (rate >= 90) return "text-red-600 bg-red-50";
  //   if (rate >= 75) return "text-orange-600 bg-orange-50";
  //   if (rate >= 50) return "text-yellow-600 bg-yellow-50";
  //   return "text-green-600 bg-green-50";
  // };

  return (
    <Link href={`/admin/property/${property?._id}`}>
      <Card className="hover:shadow-xl transition-all duration-300 group relative overflow-hidden border-0 shadow-md hover:scale-[1.02]">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        {/* <div className="absolute top-3 left-3 z-10">
          <Badge
            variant={property?.isActive ? "default" : "secondary"}
            className={`${
              property?.isActive
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-600 border-gray-200"
            } shadow-sm`}
          >
            {property?.isActive ? "Active" : "Inactive"}
          </Badge>
        </div> */}

        <CardContent className="p-6 relative z-10">
          {/* Property Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                {property?.name}
              </h3>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">
                {property?.address?.city}, {property?.address?.state}
              </span>
            </div>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Home className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-600">
                  Total Lots
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {property?.totalSpots || 0}
              </div>
            </div>

            <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-gray-600">
                  Available
                </span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {property?.availableSpots || 0}
              </div>
            </div>
          </div>

          {/* Occupancy Rate */}
          {/* <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Occupancy Rate
              </span>
              <span
                className={`text-sm font-bold px-2 py-1 rounded-full ${getOccupancyColor(
                  getOccupancyRate()
                )}`}
              >
                {getOccupancyRate()}%
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
          </div> */}

          {/* Amenities Preview */}
          {property?.amenities && property.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">
                  Amenities
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-white/60"
                  >
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-white/60">
                    +{property.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Click Area */}
          {/* <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white/80 hover:bg-white border-gray-200 hover:border-blue-300 transition-all duration-300"
              onClick={() =>
                (window.location.href = `/admin/property/${property?.id}`)
              }
            >
              View Details
            </Button>
          </div> */}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
    </Link>
  );
}
