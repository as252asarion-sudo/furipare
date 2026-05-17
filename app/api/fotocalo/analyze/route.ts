import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { base64, mediaType, foodNameHint } = await request.json() as {
      base64: string
      mediaType: 'image/jpeg' | 'image/png' | 'image/webp'
      foodNameHint?: string
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 768,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          {
            type: 'text',
            text: `${foodNameHint ? `この料理は「${foodNameHint}」です。この料理名を前提にカロリーとPFCを推定してください。\n` : 'この食事の写真を分析して、カロリーとPFCを推定してください。'}
日本食品標準成分表に基づいた正確な値を使うこと。主な参考値: 鶏卵1個(50g)=76kcal、白米1杯(150g)=252kcal、食パン1枚(60g)=158kcal、豆腐1/2丁(150g)=108kcal、鶏むね肉100g=116kcal、豚バラ100g=395kcal。写真からの量の推定は控えめにし、過大評価しないこと。
JSONのみで返してください（説明文不要）。
形式: {"name":"食事名","calories":数値,"protein":数値,"fat":数値,"carbs":数値,"confidence":"high/medium/low","note":"補足コメント","ingredients":[{"name":"食材名","amount":"量（例：200g, 2個）","calories":数値}]}
ingredientsは主な食材を3〜5個。amountは目安量を必ず返す。`,
          },
        ],
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
