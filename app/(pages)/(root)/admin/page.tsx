import AdminDashboard from "@/app/(pages)/(root)/admin/(components)/AdminDashboard";

// Force dynamic rendering since this page makes API calls
// export const dynamic = "force-dynamic";

export default async function AdminPage() {
  return <AdminDashboard />;
}
