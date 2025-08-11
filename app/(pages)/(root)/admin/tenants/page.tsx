import { getAllTenants } from "@/app/apiClient/adminApi";
import { ITenant } from "@/types/tenant.types";
import TenantsPage from "./(components)/TenantsPage";

export default async function page() {
  const tenantsResponse = await getAllTenants();

  const tenants: ITenant[] = Array.isArray(tenantsResponse.data)
    ? tenantsResponse.data
    : [];
  console.log("🚀 ~ tenants:", tenants);

  return (
    <section>
      <TenantsPage tenants={tenants} />
    </section>
  );
}
