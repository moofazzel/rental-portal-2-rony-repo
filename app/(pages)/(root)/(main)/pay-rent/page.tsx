import { getRentSummary } from "@/app/apiClient/tenantApi";
import { IPaymentSummary } from "@/types/payment.types";
import PayRent from "./(components)/PayRent";

export default async function PayRentPage() {
  try {
    // get the rent summary
    const result = await getRentSummary();
    const payments = result as IPaymentSummary;
    console.log("🚀 ~ payments:", payments);

    return (
      <div>
        <PayRent rentData={payments} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching rent summary:", error);
    return (
      <div>
        <PayRent rentData={null} />
      </div>
    );
  }
}
