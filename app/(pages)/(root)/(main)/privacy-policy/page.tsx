"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <Card className="shadow-md">
        <CardContent className="p-6 space-y-4 text-sm text-gray-700">
          <p>
            At Beck Row, we respect your privacy and are committed to protecting
            your personal information. This Privacy Policy outlines how we
            collect, use, and safeguard your data.
          </p>

          <h2 className="text-lg font-semibold">1. Information We Collect</h2>
          <ul className="list-disc list-inside">
            <li>
              Personal details such as name, email, phone number, and address
            </li>
            <li>Rental history and payment information</li>
            <li>Device and browser data for improving user experience</li>
          </ul>

          <h2 className="text-lg font-semibold">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside">
            <li>To manage your tenant profile and rental agreements</li>
            <li>To process payments and maintain records</li>
            <li>To improve our services and provide support</li>
          </ul>

          <h2 className="text-lg font-semibold">
            3. Data Sharing and Security
          </h2>
          <p>
            We do not sell your personal information. Data may be shared with
            trusted service providers for functionality (e.g., payment
            processing). We implement security measures to protect your data.
          </p>

          <h2 className="text-lg font-semibold">4. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. You may contact us at privacy@rentalportal.com for any
            requests or concerns.
          </p>

          <h2 className="text-lg font-semibold">5. Updates to This Policy</h2>
          <p>
            We may update this policy occasionally. Any changes will be posted
            on this page with an updated revision date.
          </p>

          <p className="text-xs text-gray-400">Last updated: June 2025</p>
        </CardContent>
      </Card>
    </div>
  );
}
