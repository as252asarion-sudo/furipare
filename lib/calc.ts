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
