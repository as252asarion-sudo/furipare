'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { checkLimit } from './checkLimit'
import type { Contract } from './types'

function rowToContract(row: Record<string, unknown>): Contract {
  const data = (row.data ?? {}) as Record<string, unknown>
  return {
    id: row.id as string,
    clientId: data.clientId as string ?? '',
    projectName: data.projectName as string ?? '',
    profession: data.profession as Contract['profession'] ?? 'designer',
    startDate: data.startDate as string ?? '',
    endDate: data.endDate as string ?? '',
    amount: data.amount as number ?? 0,
    revisionCount: data.revisionCount as number ?? 3,
    copyrightOwner: data.copyrightOwner as Contract['copyrightOwner'] ?? 'client',
    portfolioAllowed: data.portfolioAllowed as boolean ?? false,
    note: data.note as string ?? '',
    status: data.status as Contract['status'] ?? 'draft',
    createdAt: row.created_at as string,
  }
}

export async function getContracts(): Promise<Contract[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getContracts error:', error)
    return []
  }

  return (data ?? []).map(rowToContract)
}

export async function getContract(id: string): Promise<Contract | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null
  return rowToContract(data)
}

export async function saveContractAction(id: string | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const data = JSON.parse(formData.get('data') as string) as Omit<Contract, 'id' | 'createdAt'>

  if (id) {
    const { error } = await supabase
      .from('contracts')
      .update({ data })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
  } else {
    const limitResult = await checkLimit('contracts')
    if (!limitResult.ok) return { limitExceeded: true, limit: limitResult.limit, current: limitResult.current }

    const { error } = await supabase
      .from('contracts')
      .insert({
        user_id: user.id,
        data,
      })

    if (error) throw new Error(error.message)
  }

  revalidatePath('/contracts')
  redirect('/contracts')
}

export async function deleteContract(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('contracts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/contracts')
}
