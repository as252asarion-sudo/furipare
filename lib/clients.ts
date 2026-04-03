'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { checkLimit } from './checkLimit'
import type { Client } from './types'

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getClients error:', error)
    return []
  }

  return (data ?? []).map(row => ({
    id: row.id,
    name: row.name,
    contactName: row.data?.contactName ?? '',
    email: row.email ?? '',
    address: row.address ?? '',
    createdAt: row.created_at,
  }))
}

export async function getClient(id: string): Promise<Client | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    name: data.name,
    contactName: data.data?.contactName ?? '',
    email: data.email ?? '',
    address: data.address ?? '',
    createdAt: data.created_at,
  }
}

export async function createClient_(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const contactName = formData.get('contactName') as string
  const email = formData.get('email') as string
  const address = formData.get('address') as string

  const limitResult = await checkLimit('clients')
  if (!limitResult.ok) return { limitExceeded: true, limit: limitResult.limit, current: limitResult.current }

  const { error } = await supabase.from('clients').insert({
    user_id: user.id,
    name,
    email: email || null,
    address: address || null,
    data: { contactName },
  })

  if (error) throw new Error(error.message)

  revalidatePath('/clients')
  redirect('/clients')
}

export async function updateClient(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const contactName = formData.get('contactName') as string
  const email = formData.get('email') as string
  const address = formData.get('address') as string

  const { error } = await supabase
    .from('clients')
    .update({
      name,
      email: email || null,
      address: address || null,
      data: { contactName },
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/clients')
  redirect('/clients')
}

export async function deleteClient(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/clients')
}
