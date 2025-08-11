"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function QuickActions() {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Link href="/pay-rent">
          <Button
            size="lg"
            className="w-full justify-start bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white cursor-pointer"
          >
            Pay Rent
          </Button>
        </Link>
        <Link href="/services">
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-start border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Request Service
          </Button>
        </Link>
        <Link href="/history">
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-start border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Payment History
          </Button>
        </Link>
        <Link href="/my-info">
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-start border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Update Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
