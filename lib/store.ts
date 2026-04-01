'use client'

const SETTINGS_KEY = 'furipare_settings'

// Settings (PDF出力用の自分情報のみlocalStorageで管理)
export function getSettings(): { myName: string; myAddress: string; myEmail: string; myBankInfo: string } {
  if (typeof window === 'undefined') return { myName: '', myAddress: '', myEmail: '', myBankInfo: '' }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) {
      // 旧フォーマット(furipare_data)からの移行サポート
      const legacy = localStorage.getItem('furipare_data')
      if (legacy) {
        const d = JSON.parse(legacy)
        return {
          myName: d.myName ?? '',
          myAddress: d.myAddress ?? '',
          myEmail: d.myEmail ?? '',
          myBankInfo: d.myBankInfo ?? '',
        }
      }
      return { myName: '', myAddress: '', myEmail: '', myBankInfo: '' }
    }
    return JSON.parse(raw)
  } catch {
    return { myName: '', myAddress: '', myEmail: '', myBankInfo: '' }
  }
}

export function saveSettings(s: { myName: string; myAddress: string; myEmail: string; myBankInfo: string }) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
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
