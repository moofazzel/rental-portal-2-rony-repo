import { getAllDocuments, getAllProperties } from "@/app/apiClient/adminApi";
import AdminDocumentsClient from "./components/AdminDocumentsClient";

// export const dynamic = "force-dynamic";

export default async function AdminDocuments() {
  // Fetch properties and documents in parallel
  const [propertiesResult, documentsResult] = await Promise.all([
    getAllProperties(),
    getAllDocuments(),
  ]);

  // Extract data from results
  const properties =
    propertiesResult.success && propertiesResult.data
      ? propertiesResult.data
          .map((prop) => ({ id: prop.id || prop._id, name: prop.name }))
          .filter((prop): prop is { id: string; name: string } =>
            Boolean(prop.id)
          )
      : [];

  const documents = documentsResult.success ? documentsResult.data || [] : [];

  return <AdminDocumentsClient properties={properties} documents={documents} />;
}
