'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { calcSubtotal, calcTax, calcTotal } from './calc'
import { checkLimit } from './checkLimit'
import type { Invoice } from './types'

function rowToInvoice(row: Record<string, unknown>): Invoice {
  const data = (row.data ?? {}) as Record<string, unknown>
  return {
    id: row.id as string,
    estimateId: data.estimateId as string | undefined,
    clientId: data.clientId as string ?? '',
    projectName: data.projectName as string ?? '',
    profession: data.profession as Invoice['profession'] ?? 'designer',
    items: data.items as Invoice['items'] ?? [],
    taxRate: data.taxRate as number ?? 10,
    withholdingTax: data.withholdingTax as boolean ?? false,
    note: data.note as string ?? '',
    dueDate: row.due_date as string ?? '',
    status: row.status as Invoice['status'] ?? 'unpaid',
    createdAt: row.created_at as string,
  }
}

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getInvoices error:', error)
    return []
  }

  return (data ?? []).map(rowToInvoice)
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null
  return rowToInvoice(data)
}

export async function getInvoiceCount(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return count ?? 0
}

export async function saveInvoiceAction(id: string | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const data = JSON.parse(formData.get('data') as string) as Omit<Invoice, 'id' | 'createdAt'>
  const subtotal = calcSubtotal(data.items)
  const tax = calcTax(subtotal, data.taxRate)
  const total = calcTotal(subtotal, tax, data.withholdingTax)

  // clientsテーブルのUUIDを取得（clientIdはUUID想定）
  const clientId = data.clientId || null

  if (id) {
    const { error } = await supabase
      .from('invoices')
      .update({
        client_id: clientId,
        status: data.status,
        due_date: data.dueDate || null,
        total_amount: total,
        data,
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
  } else {
    const limitResult = await checkLimit('invoices')
    if (!limitResult.ok) return { limitExceeded: true, limit: limitResult.limit, current: limitResult.current }

    const { error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        client_id: clientId,
        status: data.status,
        due_date: data.dueDate || null,
        total_amount: total,
        data,
      })

    if (error) throw new Error(error.message)
  }

  revalidatePath('/invoices')
  redirect('/invoices')
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/invoices')
}
