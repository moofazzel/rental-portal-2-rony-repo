import { getAllServiceRequests } from "@/app/apiClient/adminApi";
import { Suspense } from "react";
import { RequestedServices } from "./(components)/RequestedServices";
import { IServiceRequest } from "./types/service-request";

type GetAllServiceRequestsResponse = {
  serviceRequests: IServiceRequest[];
};

export default async function ServicesRequestsPage() {
  const result = await getAllServiceRequests();

  let serviceRequests: IServiceRequest[] = [];

  if (result?.data && "serviceRequests" in result.data) {
    serviceRequests = (result.data as GetAllServiceRequestsResponse)
      .serviceRequests;
  } else {
    console.warn("No serviceRequests found in API response:", result.data);
  }

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <RequestedServices serviceRequests={serviceRequests} />
      </Suspense>
    </div>
  );
}
