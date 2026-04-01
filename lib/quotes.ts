'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Estimate } from './types'

function rowToEstimate(row: Record<string, unknown>): Estimate {
  const data = (row.data ?? {}) as Record<string, unknown>
  return {
    id: row.id as string,
    clientId: data.clientId as string ?? '',
    projectName: data.projectName as string ?? '',
    profession: data.profession as Estimate['profession'] ?? 'designer',
    items: data.items as Estimate['items'] ?? [],
    taxRate: data.taxRate as number ?? 10,
    withholdingTax: data.withholdingTax as boolean ?? false,
    note: data.note as string ?? '',
    validUntil: data.validUntil as string ?? '',
    status: data.status as Estimate['status'] ?? 'draft',
    createdAt: row.created_at as string,
  }
}

export async function getEstimates(): Promise<Estimate[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getEstimates error:', error)
    return []
  }

  return (data ?? []).map(rowToEstimate)
}

export async function getEstimate(id: string): Promise<Estimate | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null
  return rowToEstimate(data)
}

export async function saveEstimateAction(id: string | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const data = JSON.parse(formData.get('data') as string) as Omit<Estimate, 'id' | 'createdAt'>
  const clientId = data.clientId || null

  if (id) {
    const { error } = await supabase
      .from('quotes')
      .update({
        client_id: clientId,
        data,
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('quotes')
      .insert({
        user_id: user.id,
        client_id: clientId,
        data,
      })

    if (error) throw new Error(error.message)
  }

  revalidatePath('/estimates')
  redirect('/estimates')
}

export async function deleteEstimate(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/estimates')
}
