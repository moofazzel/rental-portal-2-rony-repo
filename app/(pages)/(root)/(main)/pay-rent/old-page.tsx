"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PayRent() {
  const [method, setMethod] = useState("credit");
  const [month, setMonth] = useState("June 2025");

  return (
    <Card className="max-w-5xl mx-auto my-10 shadow-xl rounded-2xl border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold text-center text-teal-700">
          Pay Rent
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left side: form */}
        <div className="space-y-6">
          <div>
            <Label className="text-gray-700 mb-1 block">Amount</Label>
            <div className="text-lg font-semibold">$1,200.00</div>
          </div>

          <div>
            <Label className="text-gray-700 mb-1 block">Paying For</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="June 2025">June 2025</SelectItem>
                <SelectItem value="July 2025">July 2025</SelectItem>
                <SelectItem value="August 2025">August 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700 mb-2 block">
              Select Payment Method
            </Label>
            <RadioGroup
              value={method}
              onValueChange={setMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="debit" id="debit" />
                <Label htmlFor="debit">Debit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank Transfer (ACH)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mt-4">
            <Button className="w-full md:w-1/2 mx-auto block">Pay Now</Button>
          </div>
        </div>

        {/* Right side: Billing summary / details */}
        <div className="bg-gray-50 rounded-xl border border-dashed p-6 space-y-4">
          <h4 className="text-teal-800 font-semibold text-lg">
            Billing Summary
          </h4>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Monthly Rent</span>
            <span>$1,200.00</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Late Fee</span>
            <span>$0.00</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold text-gray-800">
            <span>Total Due</span>
            <span>$1,200.00</span>
          </div>

          <div className="pt-6 text-xs text-gray-500">
            <p>
              <strong>Note:</strong> Payments after the 5th of the month may
              incur late fees. All transactions are secure and processed by
              Stripe.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
