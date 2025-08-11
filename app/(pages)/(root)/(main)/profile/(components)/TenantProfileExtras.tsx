"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Info, Mail, MessageCircle, User } from "lucide-react";

export default function TenantProfileExtras() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* 1. Service Requests Summary */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Recent Service Requests
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>🚿 Leaky shower - <span className="text-green-700">Resolved</span></li>
            <li>💡 Porch light issue - <span className="text-yellow-600">In Progress</span></li>
            <li>🗑 Trash pickup delay - <span className="text-gray-500">Submitted</span></li>
          </ul>
        </CardContent>
      </Card>

      {/* 2. Notices / Announcements */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" /> Announcements
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>📣 Power outage scheduled on June 22</li>
            <li>📜 Park rules updated – view in documents</li>
          </ul>
        </CardContent>
      </Card>

      {/* 3. Documents */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" /> Documents
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex justify-between items-center">
              Lease_Agreement.pdf <Button variant="link" size="sm">Download</Button>
            </li>
            <li className="flex justify-between items-center">
              Payment_Receipt_May2025.pdf <Button variant="link" size="sm">Download</Button>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* 4. Contact Site Manager */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" /> Site Manager
          </h3>
          <p className="text-sm text-gray-700">Maria Manager</p>
          <p className="text-sm text-gray-500">📧 maria@rvadmin.com</p>
          <p className="text-sm text-gray-500 mb-3">📞 (205) 555-1234</p>
          <Button variant="outline" size="sm" className="text-sm">
            <MessageCircle className="w-4 h-4 mr-1" /> Send Message
          </Button>
        </CardContent>
      </Card>

      {/* 5. Upcoming Events / Reminders */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-orange-500" /> Reminders
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>🗑 Trash Day: Every Tuesday</li>
            <li>📅 Lease ends in 90 days – renew soon</li>
          </ul>
        </CardContent>
      </Card>

      {/* 6. Activity Timeline */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Mail className="w-5 h-5 text-pink-600" /> Activity Timeline
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>📩 Invited on Feb 5, 2024</li>
            <li>🔑 First login: Feb 7, 2024</li>
            <li>💳 Last payment: May 1, 2025</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
