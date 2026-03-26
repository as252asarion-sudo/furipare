'use client'
import { AppData, Client, Estimate, Invoice, Contract } from './types'

const KEY = 'furipare_data'

function defaultData(): AppData {
  return {
    clients: [],
    estimates: [],
    invoices: [],
    contracts: [],
    myName: '',
    myAddress: '',
    myEmail: '',
    myBankInfo: '',
  }
}

export function loadData(): AppData {
  if (typeof window === 'undefined') return defaultData()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultData()
    return { ...defaultData(), ...JSON.parse(raw) }
  } catch {
    return defaultData()
  }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// Client CRUD
export function getClients(): Client[] { return loadData().clients }
export function saveClient(client: Client): void {
  const d = loadData()
  const idx = d.clients.findIndex(c => c.id === client.id)
  if (idx >= 0) d.clients[idx] = client
  else d.clients.unshift(client)
  saveData(d)
}
export function deleteClient(id: string): void {
  const d = loadData()
  d.clients = d.clients.filter(c => c.id !== id)
  saveData(d)
}

// Estimate CRUD
export function getEstimates(): Estimate[] { return loadData().estimates }
export function saveEstimate(est: Estimate): void {
  const d = loadData()
  const idx = d.estimates.findIndex(e => e.id === est.id)
  if (idx >= 0) d.estimates[idx] = est
  else d.estimates.unshift(est)
  saveData(d)
}
export function deleteEstimate(id: string): void {
  const d = loadData()
  d.estimates = d.estimates.filter(e => e.id !== id)
  saveData(d)
}

// Invoice CRUD
export function getInvoices(): Invoice[] { return loadData().invoices }
export function saveInvoice(inv: Invoice): void {
  const d = loadData()
  const idx = d.invoices.findIndex(i => i.id === inv.id)
  if (idx >= 0) d.invoices[idx] = inv
  else d.invoices.unshift(inv)
  saveData(d)
}
export function deleteInvoice(id: string): void {
  const d = loadData()
  d.invoices = d.invoices.filter(i => i.id !== id)
  saveData(d)
}

// Contract CRUD
export function getContracts(): Contract[] { return loadData().contracts }
export function saveContract(con: Contract): void {
  const d = loadData()
  const idx = d.contracts.findIndex(c => c.id === con.id)
  if (idx >= 0) d.contracts[idx] = con
  else d.contracts.unshift(con)
  saveData(d)
}
export function deleteContract(id: string): void {
  const d = loadData()
  d.contracts = d.contracts.filter(c => c.id !== id)
  saveData(d)
}

export function getSettings() {
  const d = loadData()
  return { myName: d.myName, myAddress: d.myAddress, myEmail: d.myEmail, myBankInfo: d.myBankInfo }
}
export function saveSettings(s: { myName: string; myAddress: string; myEmail: string; myBankInfo: string }) {
  const d = loadData()
  Object.assign(d, s)
  saveData(d)
}

// Calc helpers
export function calcSubtotal(items: { quantity: number; unitPrice: number }[]): number {
  return items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
}
export function calcTax(subtotal: number, taxRate: number): number {
  return Math.floor(subtotal * taxRate / 100)
}
export function calcWithholding(subtotal: number): number {
  return Math.floor(subtotal * 0.1021)
}
export function calcTotal(subtotal: number, tax: number, withholding: boolean): number {
  return subtotal + tax - (withholding ? calcWithholding(subtotal) : 0)
}

export function fmt(n: number): string {
  return n.toLocaleString('ja-JP')
}
