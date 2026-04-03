export type PlanType = 'free' | 'advance'
export type ResourceType = 'invoices' | 'quotes' | 'contracts' | 'clients'

export const PLAN_LIMITS: Record<PlanType, Record<ResourceType, number>> = {
  free: { invoices: 3, quotes: 3, contracts: 1, clients: 3 },
  advance: { invoices: Infinity, quotes: Infinity, contracts: Infinity, clients: Infinity },
}
