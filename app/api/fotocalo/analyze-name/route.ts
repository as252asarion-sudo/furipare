import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { foodText } = await request.json() as { foodText: string }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `「${foodText}」のカロリーとPFCを推定してください。複数の料理が含まれる場合はすべての合計値を返してください。日本食品標準成分表に基づいた正確な値を使うこと。主な参考値: 鶏卵1個(50g)=76kcal、白米1杯(150g)=252kcal、食パン1枚(60g)=158kcal、豆腐1/2丁(150g)=108kcal、鶏むね肉100g=116kcal、豚バラ100g=395kcal。JSONのみで返してください（説明文不要）。形式: {"name":"食事名（複数なら「A・B・C」形式）","calories":数値,"protein":数値,"fat":数値,"carbs":数値,"confidence":"high","note":"","ingredients":[{"name":"品目名","amount":"量（例：200g, 2個）","calories":数値}]} ingredientsは各品目を個別に。amountは目安量を必ず返す。数値はすべて整数または小数点1桁。`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const m = text.match(/\{[\s\S]*\}/)
    if (!m) return Response.json({ error: 'パース失敗' }, { status: 500 })
    const result = JSON.parse(m[0])
    if (!result.ingredients) result.ingredients = []
    return Response.json(result)
  } catch (e: any) {
    return Response.json({ error: e?.message ?? '解析失敗' }, { status: 500 })
  }
}
