"use client";

import { createContext, ReactNode, useContext } from "react";

const StripeAccountsContext = createContext<undefined>(undefined);

export function StripeAccountsProvider({ children }: { children: ReactNode }) {
  return (
    <StripeAccountsContext.Provider value={undefined}>
      {children}
    </StripeAccountsContext.Provider>
  );
}

export function useStripeAccounts() {
  const context = useContext(StripeAccountsContext);
  if (context === undefined) {
    throw new Error(
      "useStripeAccounts must be used within a StripeAccountsProvider"
    );
  }
  return context;
}
