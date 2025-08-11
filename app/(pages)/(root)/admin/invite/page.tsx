"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function InviteTenant() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    site: "",
    city: "",
    state: "",
    zip: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Submit logic to backend here
    setTimeout(() => setSubmitted(false), 3000);
  }
  // max-w-5xl mx-auto my-10 shadow-xl rounded-2xl border border-gray-200 bg-white
  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Invite Co-Tenant
      </h1>

      {submitted && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded text-green-700">
          <CheckCircle2 className="w-5 h-5" />
          Invitation sent! The tenant will receive login instructions via email.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-50 p-2 rounded-2xl shadow-xl"
      >
        {/* Basic Info */}
        <div>
          <label
            htmlFor="name"
            className="block font-medium text-gray-700 mb-1"
          >
            Tenant Name
          </label>
          <input
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded shadow-sm border focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <input
            name="phone"
            id="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded shadow-sm border focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded shadow-sm border focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Site Address Section */}
        <div>
          <h2 className="text-gray-600 font-semibold text-sm mb-2">
            Site Address
          </h2>

          <div className="mb-3">
            <label
              htmlFor="street"
              className="block text-sm text-gray-700 mb-1"
            >
              Street
            </label>
            <input
              name="street"
              id="street"
              value={form.street}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded shadow-sm border focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="site" className="block text-sm text-gray-700 mb-1">
              Site / Lot #
            </label>
            <input
              name="site"
              id="site"
              value={form.site}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded shadow-sm border focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="city"
                className="block text-sm text-gray-700 mb-1"
              >
                City
              </label>
              <input
                name="city"
                id="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded shadow-sm border focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="state"
                className="block text-sm text-gray-700 mb-1"
              >
                State
              </label>
              <input
                name="state"
                id="state"
                value={form.state}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded shadow-sm border focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="zip" className="block text-sm text-gray-700 mb-1">
              ZIP Code
            </label>
            <input
              name="zip"
              id="zip"
              value={form.zip}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded shadow-sm border focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitted}
          className="w-full bg-[#191919] hover:bg-[#191919] text-white font-semibold py-2 px-4 rounded-lg shadow transition disabled:opacity-60 text-lg cursor-pointer"
        >
          {submitted ? "Invitation Sent!" : "Send Invitation"}
        </button>
      </form>
    </div>
  );
}
