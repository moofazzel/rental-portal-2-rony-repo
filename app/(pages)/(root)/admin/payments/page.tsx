import { getAllPayments } from "@/app/apiClient/adminApi";
import { IAdminPaymentResponse } from "@/types/payment.types";
import PaymentsPage from "./(components)/PaymentsPage";

// Force dynamic rendering to prevent build errors with auth
export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage() {
  const res = await getAllPayments();
  const response = res.data as IAdminPaymentResponse;
  const payments = response.payments;

  return (
    <section className="flex flex-col gap-4">
      <PaymentsPage payments={payments} />
    </section>
  );
}
