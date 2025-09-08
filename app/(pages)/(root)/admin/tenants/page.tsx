import { getAllTenants } from "@/app/apiClient/adminApi";
import { ITenant } from "@/types/tenant.types";
import TenantsPage from "./(components)/TenantsPage";

// Force dynamic rendering to prevent build errors with auth
// export const dynamic = "force-dynamic";

export default async function page() {
  const tenantsResponse = await getAllTenants();

  const tenants: ITenant[] = Array.isArray(tenantsResponse.data)
    ? tenantsResponse.data
    : [];

  return (
    <section>
      <TenantsPage tenants={tenants} />
    </section>
  );
}
