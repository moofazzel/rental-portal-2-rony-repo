"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Mail, 
  Palette, 
  Globe,
  Save
} from "lucide-react";
import { toast } from "sonner";

export default function PreferencesSection() {
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [tenantActivityAlerts, setTenantActivityAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [serviceRequestAlerts, setServiceRequestAlerts] = useState(true);
  const [noticeAlerts, setNoticeAlerts] = useState(true);

  // Display preferences
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeZone, setTimeZone] = useState("America/New_York");

  // Workflow preferences
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showTutorials, setShowTutorials] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("adminPreferences");
      if (saved) {
        const preferences = JSON.parse(saved);
        if (preferences.notifications) {
          setEmailNotifications(preferences.notifications.email ?? true);
          setPushNotifications(preferences.notifications.push ?? true);
          setTenantActivityAlerts(preferences.notifications.tenantActivity ?? true);
          setPaymentAlerts(preferences.notifications.payments ?? true);
          setServiceRequestAlerts(preferences.notifications.serviceRequests ?? true);
          setNoticeAlerts(preferences.notifications.notices ?? true);
        }
        if (preferences.display) {
          setTheme(preferences.display.theme ?? "system");
          setLanguage(preferences.display.language ?? "en");
          setDateFormat(preferences.display.dateFormat ?? "MM/DD/YYYY");
          setTimeZone(preferences.display.timeZone ?? "America/New_York");
        }
        if (preferences.workflow) {
          setAutoRefresh(preferences.workflow.autoRefresh ?? true);
          setShowTutorials(preferences.workflow.showTutorials ?? false);
        }
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  }, []);

  const handleSavePreferences = () => {
    // In a real app, this would save to backend or localStorage
    const preferences = {
      notifications: {
        email: emailNotifications,
        push: pushNotifications,
        tenantActivity: tenantActivityAlerts,
        payments: paymentAlerts,
        serviceRequests: serviceRequestAlerts,
        notices: noticeAlerts,
      },
      display: {
        theme,
        language,
        dateFormat,
        timeZone,
      },
      workflow: {
        autoRefresh,
        showTutorials,
      },
    };

    // Save to localStorage for now
    localStorage.setItem("adminPreferences", JSON.stringify(preferences));
    toast.success("Preferences saved successfully");
  };

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Notifications
                </Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive browser push notifications
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="tenant-activity">Tenant Activity Alerts</Label>
                <p className="text-sm text-gray-500">
                  Get notified when tenants perform important actions
                </p>
              </div>
              <Switch
                id="tenant-activity"
                checked={tenantActivityAlerts}
                onCheckedChange={setTenantActivityAlerts}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="payment-alerts">Payment Alerts</Label>
                <p className="text-sm text-gray-500">
                  Get notified about payment updates
                </p>
              </div>
              <Switch
                id="payment-alerts"
                checked={paymentAlerts}
                onCheckedChange={setPaymentAlerts}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="service-request-alerts">Service Request Alerts</Label>
                <p className="text-sm text-gray-500">
                  Get notified about new and updated service requests
                </p>
              </div>
              <Switch
                id="service-request-alerts"
                checked={serviceRequestAlerts}
                onCheckedChange={setServiceRequestAlerts}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notice-alerts">Notice Alerts</Label>
                <p className="text-sm text-gray-500">
                  Get notified about important notices and announcements
                </p>
              </div>
              <Switch
                id="notice-alerts"
                checked={noticeAlerts}
                onCheckedChange={setNoticeAlerts}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-500" />
            Display Preferences
          </CardTitle>
          <CardDescription>
            Customize how information is displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-gray-500">
                  Choose your preferred color theme
                </p>
              </div>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Language
                </Label>
                <p className="text-sm text-gray-500">
                  Select your preferred language
                </p>
              </div>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="date-format">Date Format</Label>
                <p className="text-sm text-gray-500">
                  Choose how dates are displayed
                </p>
              </div>
              <select
                id="date-format"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="timezone">Time Zone</Label>
                <p className="text-sm text-gray-500">
                  Select your time zone
                </p>
              </div>
              <select
                id="timezone"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Preferences</CardTitle>
          <CardDescription>
            Configure how the application behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-refresh">Auto Refresh</Label>
                <p className="text-sm text-gray-500">
                  Automatically refresh data on pages
                </p>
              </div>
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-tutorials">Show Tutorials</Label>
                <p className="text-sm text-gray-500">
                  Display helpful tips and tutorials
                </p>
              </div>
              <Switch
                id="show-tutorials"
                checked={showTutorials}
                onCheckedChange={setShowTutorials}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSavePreferences} className="gap-2">
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

