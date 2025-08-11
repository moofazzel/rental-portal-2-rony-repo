"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IPropertyFull } from "@/types/properties.type";
import { Building2, CreditCard, Settings, Shield, Zap } from "lucide-react";
import AddStripeAccountModal from "./AddStripeAccountModal";
import StripeAccountAssignmentCard, {
  StripeAccount,
} from "./StripeAccountAssignmentCard";

export default function StripeAccountsClient({
  stripeAccounts,
  properties,
}: {
  stripeAccounts: StripeAccount[];
  properties: IPropertyFull[];
}) {
  //  const [globalStripeEnabled, setGlobalStripeEnabled] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const result = await getStripeAccountsData();
  //       console.log("🚀 ~ result:", result);

  //       if (result.success) {
  //         setProperties(result.properties);
  //         setAccounts(result.accounts);
  //       } else {
  //         setError(result.error || "Failed to fetch data");
  //       }
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "Failed to fetch data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const connectedAccounts = properties.filter(
    (p: IPropertyFull) => p.hasStripeAccount
  );
  const pendingAccounts = properties.filter(
    (p: IPropertyFull) => p.stripeAccount?.isVerified === false
  );
  const usingGlobalAccount = properties.filter(
    (p: IPropertyFull) => p.stripeAccount?.isGlobalAccount === true
  );

  return (
    <div className="space-y-6 container pt-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Stripe Accounts</h1>
        </div>
        <AddStripeAccountModal />
      </div>
      <p className="text-gray-600">
        Manage Stripe payment accounts for your properties
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Properties
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {properties.length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Connected Accounts
              </p>
              <p className="text-2xl font-bold text-green-600">
                {connectedAccounts.length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Setup</p>
              <p className="text-2xl font-bold text-orange-600">
                {pendingAccounts.length}
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Using Global Account
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {usingGlobalAccount.length}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Global Stripe Settings */}
      {/* <GlobalStripeSettings
        enabled={globalStripeEnabled}
        onToggle={setGlobalStripeEnabled}
      /> */}

      {/* Stripe Accounts Management */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Stripe Accounts & Property Assignments
          </h2>
          <Badge variant="outline" className="text-sm">
            {stripeAccounts.length} accounts, {connectedAccounts.length}{" "}
            connected
          </Badge>
        </div>

        <div className="space-y-6">
          {stripeAccounts.length > 0 ? (
            stripeAccounts.map((account) => (
              <StripeAccountAssignmentCard
                key={account.id}
                account={account}
                properties={properties}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Stripe Accounts
              </h3>
              <p className="text-gray-600 mb-4">
                Add your first Stripe account to start managing property
                assignments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
