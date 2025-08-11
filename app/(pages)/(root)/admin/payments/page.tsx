import { getAllPayments } from "@/app/apiClient/adminApi";
import { IAdminPaymentResponse } from "@/types/payment.types";
import PaymentsPage from "./(components)/PaymentsPage";

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
