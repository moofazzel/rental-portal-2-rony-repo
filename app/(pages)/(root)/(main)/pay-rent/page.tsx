import { getRentSummary } from "@/app/apiClient/tenantApi";
import { IPaymentSummary } from "@/types/payment.types";
import PayRent from "./(components)/PayRent";

export default async function PayRentPage() {
  // get the rent summary
  const result = await getRentSummary();
  const payments = result as IPaymentSummary;

  return (
    <div>
      <PayRent rentData={payments} />
    </div>
  );
}
