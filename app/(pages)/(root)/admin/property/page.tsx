import { getAllProperties } from "@/app/apiClient/adminApi";
import { IPropertyFull } from "@/types/properties.type";
import { Suspense } from "react";
import AllPropertiesLoadingSkeleton from "./(components)/AllPropertiesLoadingSkeleton";
import PropertyClient from "./(components)/PropertyClient";

export default async function PropertyPage() {
  const result = await getAllProperties();
  const properties = result.data as IPropertyFull[];

  if (!result.success) {
    return <div>Error loading properties</div>;
  }

  return (
    <section>
      <Suspense fallback={<AllPropertiesLoadingSkeleton />}>
        <PropertyClient properties={properties} />
      </Suspense>
    </section>
  );
}
