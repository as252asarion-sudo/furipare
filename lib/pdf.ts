'use client'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Estimate, Invoice, Contract, Client } from './types'
import { calcSubtotal, calcTax, calcWithholding, calcTotal, fmt } from './calc'
import { PROFESSIONS } from './types'

async function renderToPdf(html: string, filename: string) {
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:white;font-family:"Hiragino Sans","Yu Gothic","Meiryo",sans-serif;'
  container.innerHTML = html
  document.body.appendChild(container)

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = pdf.internal.pageSize.getHeight()
    const ratio = pdfW / canvas.width
    const scaledH = canvas.height * ratio

    let heightLeft = scaledH
    let pos = 0
    pdf.addImage(imgData, 'PNG', 0, pos, pdfW, scaledH)
    heightLeft -= pdfH

    while (heightLeft > 0) {
      pos = heightLeft - scaledH
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, pos, pdfW, scaledH)
      heightLeft -= pdfH
    }

    pdf.save(filename)
  } finally {
    document.body.removeChild(container)
  }
}

const baseStyle = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Hiragino Sans","Yu Gothic","Meiryo",sans-serif; color: #1e293b; font-size: 13px; }
    .page { padding: 48px; background: white; }
    .header { border-bottom: 3px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px; }
    .title { font-size: 28px; font-weight: bold; color: #1e293b; }
    .num { font-size: 11px; color: #64748b; margin-top: 4px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; }
    .label { color: #64748b; }
    .section { margin-top: 20px; }
    .section-title { font-weight: bold; font-size: 13px; margin-bottom: 8px; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #6366f1; color: white; padding: 6px 8px; text-align: left; }
    td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; }
    tr:nth-child(even) td { background: #f8f9ff; }
    .total-row td { font-weight: bold; background: #6366f1; color: white; }
    .parties { display: flex; justify-content: space-between; margin: 16px 0; font-size: 12px; }
    .party-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; width: 48%; }
    .party-label { color: #6366f1; font-size: 10px; font-weight: bold; margin-bottom: 4px; }
    .note-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; font-size: 12px; white-space: pre-wrap; }
    .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
    .clause { margin-bottom: 10px; font-size: 12px; display: flex; gap: 8px; }
    .clause-num { color: #6366f1; font-weight: bold; min-width: 20px; }
    .sig-box { display: flex; justify-content: space-between; margin-top: 32px; }
    .sig-item { width: 45%; }
    .sig-label { font-size: 11px; color: #64748b; margin-bottom: 4px; }
    .sig-line { border-bottom: 1px solid #1e293b; margin-bottom: 4px; height: 24px; }
    .sig-name { font-size: 11px; }
    .amount-summary { margin-top: 10px; }
    .amount-row { display: flex; justify-content: flex-end; gap: 40px; padding: 4px 0; font-size: 12px; border-bottom: 1px solid #f1f5f9; }
    .amount-total { display: flex; justify-content: flex-end; gap: 40px; padding: 8px 12px; background: #6366f1; color: white; font-weight: bold; font-size: 14px; border-radius: 4px; margin-top: 4px; }
  </style>
`

export async function generateEstimatePdf(
  estimate: Estimate,
  client: Client,
  myName: string,
  _myAddress: string,
  myEmail: string
) {
  const subtotal = calcSubtotal(estimate.items)
  const tax = calcTax(subtotal, estimate.taxRate)
  const withholding = estimate.withholdingTax ? calcWithholding(subtotal) : 0
  const total = calcTotal(subtotal, tax, estimate.withholdingTax)
  const num = `EST-${estimate.id.slice(-6).toUpperCase()}`

  const rows = estimate.items.map((item, i) => `
    <tr>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>${item.unit}</td>
      <td style="text-align:right">¥${fmt(item.unitPrice)}</td>
      <td style="text-align:right">¥${fmt(item.quantity * item.unitPrice)}</td>
    </tr>
  `).join('')

  const html = `${baseStyle}
  <div class="page">
    <div class="header">
      <div class="title">見積書</div>
      <div class="num">${num}</div>
    </div>
    <div class="row"><span><span class="label">案件名：</span>${estimate.projectName}</span><span><span class="label">発行日：</span>${estimate.createdAt.slice(0, 10)}</span></div>
    <div class="row"><span><span class="label">職種：</span>${PROFESSIONS[estimate.profession]}</span><span><span class="label">有効期限：</span>${estimate.validUntil}</span></div>
    <div class="parties">
      <div class="party-box"><div class="party-label">フリーランサー</div><div>${myName || '（未設定）'}</div><div style="font-size:11px;color:#64748b">${myEmail}</div></div>
      <div class="party-box"><div class="party-label">クライアント</div><div>${client.name}</div><div style="font-size:11px;color:#64748b">${client.email || ''}</div></div>
    </div>
    <div class="section">
      <table>
        <thead><tr><th>項目</th><th>数量</th><th>単位</th><th style="text-align:right">単価</th><th style="text-align:right">金額</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="amount-summary">
        <div class="amount-row"><span>小計</span><span>¥${fmt(subtotal)}</span></div>
        <div class="amount-row"><span>消費税（${estimate.taxRate}%）</span><span>¥${fmt(tax)}</span></div>
        ${estimate.withholdingTax ? `<div class="amount-row"><span>源泉徴収（-10.21%）</span><span>-¥${fmt(withholding)}</span></div>` : ''}
        <div class="amount-total"><span>合計</span><span>¥${fmt(total)}</span></div>
      </div>
    </div>
    ${estimate.note ? `<div class="section"><div class="section-title">備考</div><div class="note-box">${estimate.note}</div></div>` : ''}
    <div class="footer"><span>${myName} | ${myEmail}</span><span>Powered by furipare</span></div>
  </div>`

  await renderToPdf(html, `estimate-${num}.pdf`)
}

export async function generateInvoicePdf(
  invoice: Invoice,
  client: Client,
  myName: string,
  myAddress: string,
  myEmail: string,
  myBankInfo: string
) {
  const subtotal = calcSubtotal(invoice.items)
  const tax = calcTax(subtotal, invoice.taxRate)
  const withholding = invoice.withholdingTax ? calcWithholding(subtotal) : 0
  const total = calcTotal(subtotal, tax, invoice.withholdingTax)
  const num = `INV-${invoice.id.slice(-6).toUpperCase()}`

  const rows = invoice.items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>${item.unit}</td>
      <td style="text-align:right">¥${fmt(item.unitPrice)}</td>
      <td style="text-align:right">¥${fmt(item.quantity * item.unitPrice)}</td>
    </tr>
  `).join('')

  const html = `${baseStyle}
  <div class="page">
    <div class="header">
      <div class="title">請求書</div>
      <div class="num">${num}</div>
    </div>
    <div class="row"><span><span class="label">案件名：</span>${invoice.projectName}</span><span><span class="label">発行日：</span>${invoice.createdAt.slice(0, 10)}</span></div>
    <div class="row"><span><span class="label">職種：</span>${PROFESSIONS[invoice.profession]}</span><span><span class="label">支払期日：</span>${invoice.dueDate}</span></div>
    <div class="parties">
      <div class="party-box"><div class="party-label">フリーランサー</div><div>${myName || '（未設定）'}</div><div style="font-size:11px;color:#64748b">${myEmail}</div><div style="font-size:11px;color:#64748b">${myAddress}</div></div>
      <div class="party-box"><div class="party-label">クライアント</div><div>${client.name}</div><div style="font-size:11px;color:#64748b">${client.email || ''}</div></div>
    </div>
    <div class="section">
      <table>
        <thead><tr><th>項目</th><th>数量</th><th>単位</th><th style="text-align:right">単価</th><th style="text-align:right">金額</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="amount-summary">
        <div class="amount-row"><span>小計</span><span>¥${fmt(subtotal)}</span></div>
        <div class="amount-row"><span>消費税（${invoice.taxRate}%）</span><span>¥${fmt(tax)}</span></div>
        ${invoice.withholdingTax ? `<div class="amount-row"><span>源泉徴収（-10.21%）</span><span>-¥${fmt(withholding)}</span></div>` : ''}
        <div class="amount-total"><span>合計</span><span>¥${fmt(total)}</span></div>
      </div>
    </div>
    ${myBankInfo ? `<div class="section"><div class="section-title">振込先</div><div class="note-box">${myBankInfo}</div></div>` : ''}
    ${invoice.note ? `<div class="section"><div class="section-title">備考</div><div class="note-box">${invoice.note}</div></div>` : ''}
    <div class="footer"><span>${myName} | ${myEmail}</span><span>Powered by furipare</span></div>
  </div>`

  await renderToPdf(html, `invoice-${num}.pdf`)
}

export async function generateContractPdf(
  contract: Contract,
  client: Client,
  myName: string,
  _myAddress: string,
  myEmail: string,
  clauses: string[]
) {
  const num = `CON-${contract.id.slice(-6).toUpperCase()}`

  const clauseItems = clauses.map((c, i) => `
    <div class="clause"><span class="clause-num">${i + 1}.</span><span>${c}</span></div>
  `).join('')

  const html = `${baseStyle}
  <div class="page">
    <div class="header">
      <div class="title">業務委託契約書</div>
      <div class="num">${num}</div>
    </div>
    <div class="row"><span><span class="label">案件名：</span>${contract.projectName}</span><span><span class="label">締結日：</span>${contract.createdAt.slice(0, 10)}</span></div>
    <div class="row"><span><span class="label">期間：</span>${contract.startDate} ～ ${contract.endDate}</span><span><span class="label">契約金額：</span>¥${fmt(contract.amount)}（税込）</span></div>
    <div class="row"><span><span class="label">職種：</span>${PROFESSIONS[contract.profession]}</span></div>
    <div class="parties">
      <div class="party-box"><div class="party-label">フリーランサー（受託者）</div><div>${myName || '（未設定）'}</div><div style="font-size:11px;color:#64748b">${myEmail}</div></div>
      <div class="party-box"><div class="party-label">クライアント（委託者）</div><div>${client.name}</div><div style="font-size:11px;color:#64748b">${client.email || ''}</div></div>
    </div>
    <div class="section">
      <div class="section-title">契約条項</div>
      ${clauseItems}
    </div>
    ${contract.note ? `<div class="section"><div class="section-title">特記事項</div><div class="note-box">${contract.note}</div></div>` : ''}
    <div class="sig-box">
      <div class="sig-item"><div class="sig-label">フリーランサー（受託者）</div><div class="sig-line"></div><div class="sig-name">${myName}</div></div>
      <div class="sig-item"><div class="sig-label">クライアント（委託者）</div><div class="sig-line"></div><div class="sig-name">${client.name}</div></div>
    </div>
    <div class="footer"><span>${myName} | ${myEmail}</span><span>Powered by furipare</span></div>
  </div>`

  await renderToPdf(html, `contract-${num}.pdf`)
}
