"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
  method: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recent Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-slate-900">
                  {payment.description}
                </span>
                <span className="text-sm font-bold text-green-600">
                  ${payment.amount.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-slate-600">
                Paid on {payment.date} • Method: {payment.method}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100">
          <Link href="/history">
            <Button variant="outline" className="w-full text-sm">
              View Full History
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
