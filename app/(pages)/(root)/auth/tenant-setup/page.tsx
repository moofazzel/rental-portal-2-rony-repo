"use client";

import { useTenantDataFromUrl } from "@/hooks/useTenantDataFromUrl";
import { Suspense } from "react";
import ErrorMessage from "./components/ErrorMessage";
import TenantSetupForm from "./components/TenantSetupForm ";
import TenantSetupSkeleton from "./components/TenantSetupSkeleton";

const TenantSetupContent = () => {
  const { loading, error } = useTenantDataFromUrl();

  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <TenantSetupForm />
    </div>
  );
};

const TenantSetupPage = () => {
  return (
    <Suspense fallback={<TenantSetupSkeleton />}>
      <TenantSetupContent />
    </Suspense>
  );
};

export default TenantSetupPage;
