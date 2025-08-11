"use client";

import SupportForm from "./(components)/SupportForm";

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Support</h1>
      <p className="text-center text-gray-500">
        Have a question, issue, or need help? Reach out to us — we’re here to
        help you.
      </p>

      <SupportForm />

      <div className="text-center text-gray-500 text-sm">
        Or email us directly at{" "}
        <span className="font-medium">support@rentalportal.com</span>
        <br />
        Call us: <span className="font-medium">(123) 456-7890</span>
      </div>
    </div>
  );
}
