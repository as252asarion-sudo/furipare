'use client'
import jsPDF from 'jspdf'
import { Estimate, Invoice, Contract, Client } from './types'
import { calcSubtotal, calcTax, calcWithholding, calcTotal, fmt } from './store'
import { PROFESSIONS } from './types'

// jsPDF doesn't support Japanese fonts by default.
// We use a workaround: render Japanese text as base64 image via canvas,
// but since that's complex, we'll output a clean structured PDF
// and note that font rendering may be limited.
// For production, embed a Japanese font (e.g. NotoSansJP).

function addTitle(doc: jsPDF, title: string, sub: string) {
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 20, 25)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(sub, 20, 33)
  doc.setDrawColor(99, 102, 241)
  doc.setLineWidth(0.5)
  doc.line(20, 37, 190, 37)
}

function addParties(doc: jsPDF, myName: string, clientName: string, y: number): number {
  doc.setFontSize(10)
  doc.text(`[Freelancer] ${myName}`, 20, y)
  doc.text(`[Client] ${clientName}`, 120, y)
  return y + 10
}

function addItemsTable(
  doc: jsPDF,
  items: { description: string; quantity: number; unit: string; unitPrice: number }[],
  taxRate: number,
  withholdingTax: boolean,
  y: number
): number {
  const colX = [20, 95, 120, 140, 165]
  const headers = ['Item', 'Qty', 'Unit', 'Unit Price', 'Amount']

  doc.setFillColor(99, 102, 241)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.rect(20, y, 170, 7, 'F')
  headers.forEach((h, i) => doc.text(h, colX[i] + 1, y + 5))

  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'normal')
  let row = y + 7
  items.forEach((item, i) => {
    const bg = i % 2 === 0 ? [248, 249, 255] : [255, 255, 255]
    doc.setFillColor(bg[0], bg[1], bg[2])
    doc.rect(20, row, 170, 7, 'F')
    doc.text(item.description.slice(0, 30), colX[0] + 1, row + 5)
    doc.text(String(item.quantity), colX[1] + 1, row + 5)
    doc.text(item.unit, colX[2] + 1, row + 5)
    doc.text(`Y${fmt(item.unitPrice)}`, colX[3] + 1, row + 5)
    doc.text(`Y${fmt(item.quantity * item.unitPrice)}`, colX[4] + 1, row + 5)
    row += 7
  })

  row += 3
  const subtotal = calcSubtotal(items)
  const tax = calcTax(subtotal, taxRate)
  const withholding = withholdingTax ? calcWithholding(subtotal) : 0
  const total = calcTotal(subtotal, tax, withholdingTax)

  const summaryItems = [
    [`Subtotal`, `Y${fmt(subtotal)}`],
    [`Tax (${taxRate}%)`, `Y${fmt(tax)}`],
    ...(withholdingTax ? [['Withholding Tax (-10.21%)', `-Y${fmt(withholding)}`]] : []),
    [`TOTAL`, `Y${fmt(total)}`],
  ]

  summaryItems.forEach(([label, value], i) => {
    const isTotal = label === 'TOTAL'
    if (isTotal) {
      doc.setFillColor(99, 102, 241)
      doc.setTextColor(255, 255, 255)
      doc.rect(120, row, 70, 8, 'F')
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
    } else {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(30, 30, 30)
    }
    doc.text(label!, 122, row + 5.5)
    doc.text(value!, 158, row + 5.5, { align: 'right' })
    row += isTotal ? 8 : 6
    doc.setTextColor(30, 30, 30)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
  })

  return row + 5
}

export function generateEstimatePdf(
  estimate: Estimate,
  client: Client,
  myName: string,
  myAddress: string,
  myEmail: string
) {
  const doc = new jsPDF()
  const num = `EST-${estimate.id.slice(-6).toUpperCase()}`
  addTitle(doc, 'ESTIMATE', num)

  let y = 45
  doc.setFontSize(10)
  doc.text(`Project: ${estimate.projectName}`, 20, y)
  doc.text(`Date: ${estimate.createdAt.slice(0, 10)}`, 120, y)
  y += 7
  doc.text(`Valid Until: ${estimate.validUntil}`, 120, y)
  doc.text(`Profession: ${PROFESSIONS[estimate.profession]}`, 20, y)
  y += 10

  y = addParties(doc, myName || 'Your Name', client.name, y)
  y += 5

  y = addItemsTable(doc, estimate.items, estimate.taxRate, estimate.withholdingTax, y)

  if (estimate.note) {
    doc.setFontSize(9)
    doc.text('Note:', 20, y)
    y += 5
    doc.setTextColor(80, 80, 80)
    doc.text(estimate.note, 20, y, { maxWidth: 170 })
    doc.setTextColor(30, 30, 30)
  }

  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(`${myName} | ${myEmail} | ${myAddress}`, 20, 285)
  doc.text('Powered by furipare - ウラヤハカンパニー', 105, 285, { align: 'center' })

  doc.save(`estimate-${num}.pdf`)
}

export function generateInvoicePdf(
  invoice: Invoice,
  client: Client,
  myName: string,
  myAddress: string,
  myEmail: string,
  myBankInfo: string
) {
  const doc = new jsPDF()
  const num = `INV-${invoice.id.slice(-6).toUpperCase()}`
  addTitle(doc, 'INVOICE', num)

  let y = 45
  doc.setFontSize(10)
  doc.text(`Project: ${invoice.projectName}`, 20, y)
  doc.text(`Issue Date: ${invoice.createdAt.slice(0, 10)}`, 120, y)
  y += 7
  doc.text(`Due Date: ${invoice.dueDate}`, 120, y)
  doc.text(`Profession: ${PROFESSIONS[invoice.profession]}`, 20, y)
  y += 10

  y = addParties(doc, myName || 'Your Name', client.name, y)
  y += 5

  y = addItemsTable(doc, invoice.items, invoice.taxRate, invoice.withholdingTax, y)

  if (myBankInfo) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Bank Transfer Info:', 20, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text(myBankInfo, 20, y, { maxWidth: 170 })
    doc.setTextColor(30, 30, 30)
    y += 10
  }

  if (invoice.note) {
    doc.setFontSize(9)
    doc.text('Note:', 20, y)
    y += 5
    doc.setTextColor(80, 80, 80)
    doc.text(invoice.note, 20, y, { maxWidth: 170 })
  }

  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(`${myName} | ${myEmail} | ${myAddress}`, 20, 285)
  doc.text('Powered by furipare - ウラヤハカンパニー', 105, 285, { align: 'center' })

  doc.save(`invoice-${num}.pdf`)
}

export function generateContractPdf(
  contract: Contract,
  client: Client,
  myName: string,
  myAddress: string,
  myEmail: string,
  clauses: string[]
) {
  const doc = new jsPDF()
  const num = `CON-${contract.id.slice(-6).toUpperCase()}`
  addTitle(doc, 'CONTRACT', num)

  let y = 45
  doc.setFontSize(10)
  doc.text(`Project: ${contract.projectName}`, 20, y)
  doc.text(`Date: ${contract.createdAt.slice(0, 10)}`, 120, y)
  y += 7
  doc.text(`Period: ${contract.startDate} ~ ${contract.endDate}`, 20, y)
  doc.text(`Amount: Y${fmt(contract.amount)}`, 120, y)
  y += 7
  doc.text(`Profession: ${PROFESSIONS[contract.profession]}`, 20, y)
  y += 12

  y = addParties(doc, myName || 'Your Name', client.name, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Terms and Conditions', 20, y)
  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setDrawColor(230, 230, 230)
  doc.line(20, y, 190, y)
  y += 5

  clauses.forEach((clause, i) => {
    doc.setFont('helvetica', 'bold')
    doc.text(`${i + 1}.`, 20, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    const lines = doc.splitTextToSize(clause, 160)
    doc.text(lines, 28, y)
    y += lines.length * 5 + 3
    doc.setTextColor(30, 30, 30)
    if (y > 265) {
      doc.addPage()
      y = 20
    }
  })

  if (contract.note) {
    y += 3
    doc.setFont('helvetica', 'bold')
    doc.text('Additional Notes:', 20, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    const noteLines = doc.splitTextToSize(contract.note, 170)
    doc.text(noteLines, 20, y)
    y += noteLines.length * 5 + 5
    doc.setTextColor(30, 30, 30)
  }

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Signatures', 20, y)
  y += 8
  doc.setFont('helvetica', 'normal')
  doc.text('Freelancer:', 20, y)
  doc.line(45, y, 100, y)
  doc.text('Client:', 115, y)
  doc.line(133, y, 188, y)
  y += 7
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text(myName, 20, y)
  doc.text(client.name, 115, y)

  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(`${myName} | ${myEmail} | ${myAddress}`, 20, 285)
  doc.text('Powered by furipare - ウラヤハカンパニー', 105, 285, { align: 'center' })

  doc.save(`contract-${num}.pdf`)
}
