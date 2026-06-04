import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CATEGORIES = ['コード', '健康', '料理', '仕事', '学習', 'その他'] as const

export async function POST(request: NextRequest) {
  try {
    const { body } = await request.json() as { body: string }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `以下はAIチャットの回答テキストです。このテキストから得られる「具体的な知識・事実・数値・ポイント」を抽出して、タイトル・要約・カテゴリをJSONで返してください。

【要約の書き方】
- 「〇〇について説明しています」「〇〇を紹介しています」のような内容紹介は禁止
- このテキストを読んで実際に得られる知識・事実・結論そのものを書く
- 具体的な数値・固有名詞・判断基準があれば必ず含める
- 読んだ人が「何を学んだか」がわかる内容にする
- 2〜4文でまとめる

テキスト:
${body}

カテゴリは必ず次の6つのどれかを選んでください: コード, 健康, 料理, 仕事, 学習, その他

JSONのみで返してください（説明文不要）。
形式: {"title":"タイトル（20字以内）","summary":"要約","category":"カテゴリ名"}`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const m = text.match(/\{[\s\S]*\}/)
    if (!m) return Response.json({ error: 'パース失敗' }, { status: 500 })
    const result = JSON.parse(m[0])
    if (!CATEGORIES.includes(result.category)) result.category = 'その他'
    return Response.json(result)
  } catch (e: any) {
    return Response.json({ error: e?.message ?? '解析失敗' }, { status: 500 })
  }
}
