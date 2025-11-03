"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Settings,
  Bell,
  Palette,
  Globe
} from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import PreferencesSection from "./PreferencesSection";

interface AdminUserData {
  user: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    phoneNumber?: string;
    role?: string;
    profileImage?: string;
    bio?: string;
    preferredLocation?: string;
    isVerified?: boolean;
    isInvited?: boolean;
  };
}

interface AdminProfileClientProps {
  userData: AdminUserData | null;
}

export default function AdminProfileClient({ userData }: AdminProfileClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!userData || !userData.user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Unable to load profile data.</p>
        </CardContent>
      </Card>
    );
  }

  const { user } = userData;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Overview */}
      <Card className="shadow-xl rounded-2xl">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            {user.role && (
              <div className="mt-2">
                <Badge variant="outline" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button onClick={() => setIsEditModalOpen(true)} size="sm">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Details */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="p-3">
            <User className="h-4 w-4 mr-2" />
            Profile Information
          </TabsTrigger>
          <TabsTrigger value="preferences" className="p-3">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Information Tab */}
        <TabsContent value="profile" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <User className="text-blue-500 h-5 w-5" />
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  Full Name
                </div>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
              {user.phoneNumber && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </div>
                  <p className="font-medium text-gray-800">{user.phoneNumber}</p>
                </div>
              )}
              {user.preferredLocation && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    Preferred Location
                  </div>
                  <p className="font-medium text-gray-800">{user.preferredLocation}</p>
                </div>
              )}
              {user.bio && (
                <div className="space-y-1 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    Bio
                  </div>
                  <p className="font-medium text-gray-800">{user.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Shield className="text-green-500 h-5 w-5" />
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  Account Role
                </div>
                <p className="font-medium text-gray-800">
                  {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Account Status
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.isVerified ? "default" : "secondary"}>
                    {user.isVerified ? "Verified" : "Pending Verification"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="mt-6">
          <PreferencesSection />
        </TabsContent>
      </Tabs>

      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </div>
  );
}

