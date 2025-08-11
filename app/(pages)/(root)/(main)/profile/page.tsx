"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Info, CalendarCheck2, DollarSign } from "lucide-react";
import TenantProfileExtras from "./(components)/TenantProfileExtras";

export default function TenantProfilePage() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Profile Overview */}
      <Card className="shadow-xl rounded-2xl">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/avatar.jpg" alt="Tenant" />
            <AvatarFallback>JT</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Jane Tenant</h2>
            <p className="text-gray-500">janetenant@email.com</p>
            <p className="text-sm text-gray-400 mt-1">Lease since March 2024</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline">Active Tenant</Badge>
            <Button size="sm">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Details */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-gray-100 p-2 rounded-xl">
          <TabsTrigger value="overview" className="p-3">
            Overview
          </TabsTrigger>
          <TabsTrigger value="lease" className="p-3">
            Lease Info
          </TabsTrigger>
          <TabsTrigger value="payments" className="p-3">
            Payments
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Info className="text-blue-500" />
              <h3 className="text-lg font-semibold">Tenant Summary</h3>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Site</p>
                <p className="font-medium text-gray-800">
                  Lot 5B, Adamsville, AL 35005
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">(205) 555-1234</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lease Info Tab */}
        <TabsContent value="lease" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <CalendarCheck2 className="text-green-600" />
              <h3 className="text-lg font-semibold">Lease Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Lease Start:</span>
                <span>March 1, 2024</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Lease End:</span>
                <span>February 28, 2025</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Rent Amount:</span>
                <span>$1,200/month</span>
              </div>
              <Separator />
              <p className="text-xs text-gray-500">
                Need to update lease info? Contact the site manager or use the
                admin portal.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <DollarSign className="text-emerald-600" />
              <h3 className="text-lg font-semibold">Recent Payment Activity</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>April 1, 2025</span>
                <span>$1,200.00 – Paid</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>March 1, 2025</span>
                <span>$1,200.00 – Paid</span>
              </div>
              <div className="text-sm text-gray-500 pt-4">
                Next rent due on <strong>July 1, 2025</strong>.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Extra Information */}
      <TenantProfileExtras></TenantProfileExtras>
    </div>
  );
}
