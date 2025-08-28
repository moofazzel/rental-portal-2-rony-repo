import { getAllTenants } from "@/app/apiClient/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Home, Link, Mail, Phone } from "lucide-react";
import { Suspense } from "react";
import DashPendingInvitesSkeleton from "./DashPendingInvitesSkeleton";

async function DashPendingInvitesData() {
  try {
    const tenantsRes = await getAllTenants();
    const tenants =
      tenantsRes.success && tenantsRes.data ? tenantsRes.data : [];
    const pendingTenants = tenants.filter((t) => !t.isVerified);

    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            Pending Invites
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {pendingTenants.slice(0, 3).map((tenant) => (
              <div
                key={tenant._id}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="font-medium text-sm text-slate-900">
                    {tenant.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Pending
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    {tenant.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {tenant.phoneNumber}
                  </div>
                  {tenant.lotNumber && (
                    <div className="flex items-center gap-2">
                      <Home className="w-3 h-3" />
                      Lot: {tenant.lotNumber}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {pendingTenants.length === 0 && (
              <div className="p-6 text-center text-slate-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No pending invites</p>
              </div>
            )}
          </div>
          {pendingTenants.length > 3 && (
            <div className="p-4 border-t border-slate-100">
              <Link href="/admin/tenants">
                <Button variant="outline" className="w-full text-sm">
                  View All Pending
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching pending invites:", error);
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            Pending Invites
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-slate-500">
          <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm">Error loading pending invites</p>
        </CardContent>
      </Card>
    );
  }
}

export default function DashPendingInvites() {
  return (
    <Suspense fallback={<DashPendingInvitesSkeleton />}>
      <DashPendingInvitesData />
    </Suspense>
  );
}
