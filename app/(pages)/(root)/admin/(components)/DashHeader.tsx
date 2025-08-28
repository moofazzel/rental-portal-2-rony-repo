import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Route } from "@/constants/RouteConstants";
import { Bell, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashHeader() {
  const session = await auth();

  return (
    <div>
      {" "}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Dashboard{" "}
            <span className="text-blue-500 text-md">
              ({session?.user?.role})
            </span>
          </h1>
          <p className="text-slate-600 mt-2">
            Welcome back!{" "}
            <span className="text-blue-500 text-lg font-bold">
              {session?.user?.name}
            </span>{" "}
            Here&apos;s what&apos;s happening with your communities today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={Route.TenantsPath}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white cursor-pointer"
            >
              <Plus />
              Invite Tenant
            </Button>
          </Link>
          <Link href={Route.NoticesPath}>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 hover:bg-slate-50 cursor-pointer  "
            >
              <Bell />
              Create Notice
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
