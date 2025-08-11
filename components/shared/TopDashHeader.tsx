"use client";

import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Switch } from "../ui/switch";

export default function TopDashHeader() {
  const [emailMode, setEmailMode] = useState(false);

  return (
    <header className="mt-10 border container mb-5 py-3 rounded-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <div className="flex items-center gap-2">
            <Switch
              id="email-mode"
              checked={emailMode}
              onCheckedChange={setEmailMode}
            />
            <Label htmlFor="email-mode">
              {emailMode ? "Hide Email Options" : " Show Email Options"}
            </Label>
          </div>
        </div>
      </div>
    </header>
  );
}
