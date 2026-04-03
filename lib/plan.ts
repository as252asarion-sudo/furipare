export type PlanType = 'free' | 'pro'
export type ResourceType = 'invoices' | 'quotes' | 'contracts' | 'clients'

export const PLAN_LIMITS: Record<PlanType, Record<ResourceType, number>> = {
  free: { invoices: 3, quotes: 3, contracts: 1, clients: 3 },
  pro: { invoices: Infinity, quotes: Infinity, contracts: Infinity, clients: Infinity },
}
