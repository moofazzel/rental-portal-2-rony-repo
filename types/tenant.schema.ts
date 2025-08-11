// In @/types/tenant.schema.ts

export const lots = ["Lot 12A", "Lot 3C", "Lot 7B", "Lot 20F"] as const;
export type Lot = (typeof lots)[number];

export const locationOptions = [
  "Beck Row RV",
  "Pecan Ridge RV",
  "Pecan Hollow MHP",
] as const;
export type PreferredLocation = (typeof locationOptions)[number];

export interface InviteTenantInput {
  name: string;
  email: string;
  phone: string;
  lot: Lot;
  preferredLocation: PreferredLocation;
}
