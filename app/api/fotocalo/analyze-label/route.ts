import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { base64, mediaType, productName } = await request.json() as {
      base64: string
      mediaType: 'image/jpeg' | 'image/png' | 'image/webp'
      productName?: string
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          {
            type: 'text',
            text: `この画像の栄養成分表示を読み取ってください。表示されている数値をそのまま使用し、推定・計算は不要です。${productName ? `商品名は「${productName}」です。` : ''}1食分あたりの値を優先。100gあたりしかない場合はそのまま使用してください。JSONのみで返してください（説明文不要）。形式: {"name":"商品名","calories":数値,"protein":数値,"fat":数値,"carbs":数値,"confidence":"high","note":"1食分の量など補足","ingredients":[]}`,
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
    return Response.json({ error: e?.message ?? '読み取り失敗' }, { status: 500 })
  }
}
