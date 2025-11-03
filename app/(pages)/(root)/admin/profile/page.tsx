import { getTenant } from "@/app/apiClient/adminApi";
import AdminProfileClient from "./(components)/AdminProfileClient";

// export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  // Use the same endpoint for getting user profile (works for both tenant and admin)
  const userResponse = await getTenant();

  const userData = userResponse.success && userResponse.data 
    ? userResponse.data 
    : null;

  return (
    <section className="container mx-auto p-4 md:p-6 lg:p-8">
      <AdminProfileClient userData={userData} />
    </section>
  );
}

