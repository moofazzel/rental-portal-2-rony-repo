"use client";

// app/admin/property/page.tsx
import { Building2 } from "lucide-react";
import AddPropertyModal from "../(components)/AddPropertyModal";
import { PropertyCard } from "../(components)/PropertyCard";
import { IPropertyFull } from "@/types/properties.type";

export default function PropertyClient({
  properties,
}: {
  properties: IPropertyFull[];
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
              </div>
              <p className="text-gray-600">
                Manage your rental properties and lots
              </p>
            </div>
            <AddPropertyModal />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Properties
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.length}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Properties
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {properties.length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <div className="h-5 w-5 bg-green-600 rounded-full" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Lots
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.reduce((sum, p) => sum + (p.totalLots || 0), 0)}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <div className="h-5 w-5 bg-purple-600 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Properties yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first property to begin managing your
                rental portfolio.
              </p>
              <AddPropertyModal />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((propertyItem) => (
              <PropertyCard key={propertyItem.id} property={propertyItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
