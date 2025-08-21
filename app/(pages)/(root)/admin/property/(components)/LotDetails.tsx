// app/admin/property/(components)/LotDetails.tsx
import { getPropertyById } from "@/app/apiClient/adminApi";
import { ISpot } from "@/types/properties.type";
import ClientLotTable from "./ClientLotTable";

export default async function LotDetails({ spots }: { spots: ISpot[] }) {
  // Check if spots array is empty or undefined
  if (!spots || spots.length === 0) {
    return (
      <div>
        <p className="text-gray-500 italic">
          No spots found for this property.
        </p>
      </div>
    );
  }

  const response = await getPropertyById({ propertyId: spots[0].propertyId });
  const propertyAddress =
    response.success && response.data
      ? {
          street: response.data.address.street || "",
          city: response.data.address.city || "",
          state: response.data.address.state || "",
          zip: response.data.address.zip || "",
          country: response.data.address.country || "",
        }
      : {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        };

  // const res = await getSpotsByPropertyId(propertyId);
  // const spots = res.success && res.data ? res.data : [];

  // Get property details for identifierType and amenities
  const property = response.success && response.data ? response.data : null;
  const identifierType = property?.identifierType || "lotNumber";
  const availableAmenities = property?.amenities || [];

  return (
    <div>
      {/* pass the array into a client‐side table for interactivity */}
      <ClientLotTable
        spots={spots}
        propertyAddress={propertyAddress}
        identifierType={identifierType}
        availableAmenities={availableAmenities}
      />
    </div>
  );
}
