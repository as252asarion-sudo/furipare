'use server'
import { createClient } from '@/utils/supabase/server'
import { PLAN_LIMITS, type PlanType, type ResourceType } from './plan'

export type LimitCheckResult =
  | { ok: true }
  | { ok: false; limit: number; current: number }

export interface UsageSummary {
  plan: PlanType
  invoices: { current: number; limit: number }
  quotes: { current: number; limit: number }
  contracts: { current: number; limit: number }
  clients: { current: number; limit: number }
}

/**
 * 当月の作成数をカウントし、プランの上限と比較する。
 * 削除しても枠は戻らない（作成数ベース）。
 */
export async function checkLimit(resource: ResourceType): Promise<LimitCheckResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, limit: 0, current: 0 }

  // プランを取得（profiles.plan）
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan: PlanType = (profile?.plan === 'advance') ? 'advance' : 'free'
  const limit = PLAN_LIMITS[plan][resource]

  // アドバンスプランは無制限
  if (limit === Infinity) return { ok: true }

  // 当月作成数をカウント（created_at >= 今月1日 00:00:00 UTC）
  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()

  const tableMap: Record<ResourceType, string> = {
    invoices: 'invoices',
    quotes: 'quotes',
    contracts: 'contracts',
    clients: 'clients',
  }

  const { count } = await supabase
    .from(tableMap[resource])
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', monthStart)

  const current = count ?? 0

  if (current >= limit) {
    return { ok: false, limit, current }
  }

  return { ok: true }
}

/**
 * ダッシュボード用：当月の全リソース使用量を一括取得する。
 */
export async function getUsageSummary(): Promise<UsageSummary | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan: PlanType = (profile?.plan === 'advance') ? 'advance' : 'free'

  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()

  const resources: ResourceType[] = ['invoices', 'quotes', 'contracts', 'clients']
  const tableMap: Record<ResourceType, string> = {
    invoices: 'invoices',
    quotes: 'quotes',
    contracts: 'contracts',
    clients: 'clients',
  }

  const counts = await Promise.all(
    resources.map(r =>
      supabase
        .from(tableMap[r])
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', monthStart)
        .then(({ count }) => count ?? 0)
    )
  )

  const [invoiceCount, quoteCount, contractCount, clientCount] = counts

  return {
    plan,
    invoices: { current: invoiceCount, limit: PLAN_LIMITS[plan].invoices },
    quotes: { current: quoteCount, limit: PLAN_LIMITS[plan].quotes },
    contracts: { current: contractCount, limit: PLAN_LIMITS[plan].contracts },
    clients: { current: clientCount, limit: PLAN_LIMITS[plan].clients },
  }
}
