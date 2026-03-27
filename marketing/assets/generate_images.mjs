import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'

// ── ユーティリティ ──────────────────────────────
function hex(c) {
  const r = parseInt(c.slice(1,3),16), g = parseInt(c.slice(3,5),16), b = parseInt(c.slice(5,7),16)
  return `rgb(${r},${g},${b})`
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x+r, y)
  ctx.lineTo(x+w-r, y)
  ctx.quadraticCurveTo(x+w, y, x+w, y+r)
  ctx.lineTo(x+w, y+h-r)
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h)
  ctx.lineTo(x+r, y+h)
  ctx.quadraticCurveTo(x, y+h, x, y+h-r)
  ctx.lineTo(x, y+r)
  ctx.quadraticCurveTo(x, y, x+r, y)
  ctx.closePath()
}

// ── アイコン（400×400）──────────────────────────
function generateIcon() {
  const canvas = createCanvas(400, 400)
  const ctx = canvas.getContext('2d')

  // 背景グラデーション
  const bg = ctx.createLinearGradient(0, 0, 400, 400)
  bg.addColorStop(0, '#6366f1')
  bg.addColorStop(1, '#7c3aed')
  roundRect(ctx, 0, 0, 400, 400, 80)
  ctx.fillStyle = bg
  ctx.fill()

  // 書類1枚目（白）
  ctx.save()
  roundRect(ctx, 118, 88, 122, 158, 10)
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.fill()
  // 折り角
  ctx.beginPath()
  ctx.moveTo(218, 88)
  ctx.lineTo(240, 110)
  ctx.lineTo(218, 110)
  ctx.closePath()
  ctx.fillStyle = '#c7d2fe'
  ctx.fill()
  // 線
  roundRect(ctx, 133, 113, 72, 8, 4); ctx.fillStyle='#6366f1'; ctx.fill()
  roundRect(ctx, 133, 131, 90, 6, 3); ctx.fillStyle='#a5b4fc'; ctx.fill()
  roundRect(ctx, 133, 147, 80, 6, 3); ctx.fill()
  roundRect(ctx, 133, 163, 85, 6, 3); ctx.fill()
  roundRect(ctx, 133, 179, 60, 6, 3); ctx.fill()
  ctx.restore()

  // 書類2枚目（少しずらして重ねる）
  ctx.save()
  roundRect(ctx, 148, 152, 122, 158, 10)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(248, 152)
  ctx.lineTo(270, 174)
  ctx.lineTo(248, 174)
  ctx.closePath()
  ctx.fillStyle = '#ddd6fe'
  ctx.fill()
  roundRect(ctx, 163, 177, 72, 8, 4); ctx.fillStyle='#6366f1'; ctx.fill()
  roundRect(ctx, 163, 195, 90, 6, 3); ctx.fillStyle='#c4b5fd'; ctx.fill()
  roundRect(ctx, 163, 211, 75, 6, 3); ctx.fill()
  roundRect(ctx, 163, 227, 85, 6, 3); ctx.fill()
  ctx.restore()

  // テキスト「フリパレ」
  ctx.fillStyle = 'white'
  ctx.font = 'bold 40px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('フリパレ', 200, 338)

  ctx.fillStyle = 'rgba(199,210,254,0.9)'
  ctx.font = '15px sans-serif'
  ctx.fillText('furipare.vercel.app', 200, 364)

  const buf = canvas.toBuffer('image/png')
  writeFileSync('./marketing/assets/icon.png', buf)
  console.log('✅ icon.png 生成完了（400×400）')
}

// ── ヘッダー（1500×500）────────────────────────
function generateHeader() {
  const canvas = createCanvas(1500, 500)
  const ctx = canvas.getContext('2d')

  // 背景グラデーション
  const bg = ctx.createLinearGradient(0, 0, 1500, 500)
  bg.addColorStop(0, '#4f46e5')
  bg.addColorStop(0.6, '#7c3aed')
  bg.addColorStop(1, '#6d28d9')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 1500, 500)

  // 装飾サークル
  function circle(x, y, r, op) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI*2)
    ctx.fillStyle = `rgba(255,255,255,${op})`
    ctx.fill()
  }
  circle(1300, -50, 300, 0.04)
  circle(1400, 550, 250, 0.04)
  circle(100, 450, 200, 0.04)

  // 浮かぶ書類カード（装飾）
  function card(x, y, w, h, label) {
    ctx.save()
    roundRect(ctx, x, y, w, h, 16)
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
    // 線
    roundRect(ctx, x+20, y+30, 100, 12, 6); ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fill()
    roundRect(ctx, x+20, y+54, 140, 8, 4); ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.fill()
    roundRect(ctx, x+20, y+70, 120, 8, 4); ctx.fill()
    roundRect(ctx, x+20, y+86, 130, 8, 4); ctx.fill()
    roundRect(ctx, x+20, y+102, 100, 8, 4); ctx.fill()
    // ラベルバッジ
    roundRect(ctx, x+20, y+h-50, w-40, 30, 8)
    ctx.fillStyle='rgba(255,255,255,0.18)'; ctx.fill()
    ctx.fillStyle='rgba(255,255,255,0.85)'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(label, x+w/2, y+h-30)
    ctx.restore()
  }
  card(900,  60, 200, 260, '見積書')
  card(1120, 130, 200, 250, '請求書')
  card(1330, 80, 200, 270, '契約書')

  // メインタイトル
  ctx.textAlign = 'left'
  ctx.fillStyle = 'white'
  ctx.font = 'bold 78px sans-serif'
  ctx.fillText('フリパレ', 120, 200)

  // キャッチコピー
  ctx.font = '28px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fillText('フリーランスの書類地獄を、終わらせよう。', 120, 258)

  // サブコピー
  ctx.font = '18px sans-serif'
  ctx.fillStyle = '#c7d2fe'
  ctx.fillText('見積書・請求書・契約書を、職種別テンプレートで5分で作成', 122, 300)

  // URL バッジ
  roundRect(ctx, 120, 330, 310, 46, 23)
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fill()
  ctx.fillStyle = 'white'
  ctx.font = '17px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('furipare.vercel.app', 275, 359)

  // 無料バッジ
  roundRect(ctx, 450, 330, 130, 46, 23)
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fill()
  ctx.fillStyle = '#4f46e5'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText('無料で始める', 515, 359)

  const buf = canvas.toBuffer('image/png')
  writeFileSync('./marketing/assets/header.png', buf)
  console.log('✅ header.png 生成完了（1500×500）')
}

generateIcon()
generateHeader()
console.log('\n📁 保存先: furipare/marketing/assets/')
