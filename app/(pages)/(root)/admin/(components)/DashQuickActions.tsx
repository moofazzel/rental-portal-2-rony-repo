import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, FileText, Users, Wrench, Zap } from "lucide-react";
import Link from "next/link";

export default function DashQuickActions() {
  return (
    <div>
      {" "}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Link href="/admin/tenants">
            <Button
              size="lg"
              className="w-full justify-start bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white cursor-pointer"
            >
              <Users className="w-4 h-4 mr-3" />
              Manage Tenants
            </Button>
          </Link>
          <Link href="/admin/payments">
            <Button
              size="lg"
              variant="outline"
              className="w-full justify-start border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 mr-3" />
              View Payments
            </Button>
          </Link>
          <Link href="/admin/notices">
            <Button
              size="lg"
              variant="outline"
              className="w-full justify-start border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-3" />
              Manage Notices
            </Button>
          </Link>
          <Link href="/admin/requests">
            <Button
              size="lg"
              variant="outline"
              className="w-full justify-start border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <Wrench className="w-4 h-4 mr-3" />
              Service Requests
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
