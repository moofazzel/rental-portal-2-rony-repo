"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TenantData {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredLocation: string;
  propertyId: string;
  spotId: string;
  property: {
    id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  spot: {
    id: string;
    spotNumber: string;
    description: string;
  };
}

export const useTenantDataFromUrl = () => {
  const searchParams = useSearchParams();
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const encoded = searchParams.get("data");

    if (!encoded) {
      setError("Invalid Setup link. Please Try again");
      setLoading(false);
      return;
    }

    try {
      const decodedString = atob(decodeURIComponent(encoded));
      const parsed: TenantData = JSON.parse(decodedString);
      setTenantData(parsed);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to parse tenant data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  return { tenantData, loading, error };
};
