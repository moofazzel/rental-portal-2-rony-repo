// File: app/admin/property/[id]/page.tsx

import { getPropertyById } from "@/app/apiClient/adminApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import LotDetails from "../(components)/LotDetails";
import PropertyDetailsCard from "../(components)/PropertyDetailsCard";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await getPropertyById({ propertyId: id });

  if (!response.success || !response.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Property Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                The property you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
              <Link href="/admin/property">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Communities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/admin/property">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to properties
            </Button>
          </Link>
        </div>

        {/* Property Details */}
        <PropertyDetailsCard propertyDetails={response.data} />

        {/* Lot Details Section */}
        <section className="mt-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Lot Details
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage lots and spots for this property
                </p>
              </div>
            </div>
            <LotDetails propertyId={id} />
          </div>
        </section>
      </div>
    </div>
  );
}
