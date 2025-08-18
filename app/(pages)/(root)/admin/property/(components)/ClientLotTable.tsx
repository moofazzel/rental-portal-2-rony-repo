"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ISpot } from "@/types/properties.type";
import { CheckCircle2, XCircle, Zap } from "lucide-react";
import { useState } from "react";
import EditLotModal from "./EditLotModal";

interface Props {
  spots: ISpot[];
  propertyAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  identifierType: "lotNumber" | "roadNumber";
  availableAmenities: string[];
}

export default function ClientLotTable({
  spots,
  propertyAddress,
  identifierType,
  availableAmenities,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getStatusClasses = (status: ISpot["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-yellow-100 text-yellow-800"; // Yellow for potential opportunity
      case "BOOKED":
        return "bg-emerald-100 text-emerald-800"; // Green for revenue-generating
      case "MAINTENANCE":
        return "bg-orange-100 text-orange-800";
      case "RESERVED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get electric amenities
  const getElectricAmenities = (amenities: string[]) => {
    const electricAmenities = amenities.filter(
      (amenity) => amenity === "30 AMP" || amenity === "50 AMP"
    );
    return electricAmenities;
  };

  return (
    <>
      <div className="overflow-x-auto border rounded-md">
        <Table className="min-w-full text-sm text-left">
          <TableHeader className="bg-gray-100 font-medium">
            <TableRow>
              <TableHead className="p-2">Spot</TableHead>
              <TableHead className="p-2">Size</TableHead>
              <TableHead className="p-2">Price (D/W/M)</TableHead>
              <TableHead className="p-2">Electric</TableHead>
              <TableHead className="p-2">Status</TableHead>
              <TableHead className="p-2">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spots.map((s) => {
              const electricAmenities = getElectricAmenities(s.amenities);
              return (
                <TableRow
                  key={s.id}
                  className={`border-t cursor-pointer `}
                  onClick={() => setSelectedId(s.id)}
                >
                  <TableCell className="p-2">{s.spotNumber}</TableCell>
                  <TableCell className="p-2">
                    {s.size.length}×{s.size.width} ft
                  </TableCell>
                  <TableCell className="p-2">
                    ${s.price.daily}/${s.price.weekly}/${s.price.monthly}
                  </TableCell>
                  <TableCell className="p-2">
                    {electricAmenities.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-medium">
                          {electricAmenities.join(", ")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">None</span>
                    )}
                  </TableCell>
                  <TableCell className="p-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                        s.status
                      )}`}
                    >
                      {s.status}
                    </span>
                  </TableCell>
                  <TableCell className="p-2">
                    {s.isActive ? (
                      <CheckCircle2 className="inline-block w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="inline-block w-5 h-5 text-red-600" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedId && (
        <EditLotModal
          spot={spots.find((s) => s.id === selectedId)!}
          propertyAddress={propertyAddress}
          identifierType={identifierType}
          availableAmenities={availableAmenities}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
