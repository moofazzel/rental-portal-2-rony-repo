import { getStripeAccountsData } from "@/app/actions/stripe-accounts";
import { StripeAccountsProvider } from "@/contexts/StripeAccountsContext";
import { IPropertyFull } from "@/types/properties.type";
import { Suspense } from "react";
import StripeAccountsClient from "./(components)/StripeAccountsClient";
import StripeAccountsSkeleton from "./(components)/StripeAccountsSkeleton";

// Force dynamic rendering to prevent build errors with auth
export const dynamic = "force-dynamic";

export default async function StripeAccountsPage() {
  const result = await getStripeAccountsData();

  const stripeAccounts = result.accounts;
  const properties = result.properties as IPropertyFull[];

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <section>
      <StripeAccountsProvider>
        <Suspense fallback={<StripeAccountsSkeleton />}>
          <StripeAccountsClient
            stripeAccounts={stripeAccounts}
            properties={properties}
          />
        </Suspense>
      </StripeAccountsProvider>
    </section>
  );
}
