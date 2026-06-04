import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

type LogInput = { title: string; summary: string; body: string }

export async function POST(request: NextRequest) {
  try {
    const { logs, category } = await request.json() as { logs: LogInput[]; category: string }

    if (!logs?.length) {
      return Response.json({ error: 'ログがありません' }, { status: 400 })
    }

    const logTexts = logs.map((l, i) =>
      `【ログ${i + 1}】${l.title}\n${l.summary || l.body.slice(0, 300)}`
    ).join('\n\n')

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `以下は「${category}」カテゴリに関して収集した${logs.length}件の知識ログです。

${logTexts}

これらを「自分専用のまとめWiki」として再構成してください。

【ルール】
- 関連する知識をグループ化して見出しをつける（## 見出し の形式）
- 各セクションに重要な事実・数値・ポイントを具体的に書く
- 単なる箇条書きではなく、読み返したときに実用的な参照ドキュメントにする
- 複数ログの内容を横断して関連付け・比較・整理する
- タイトルはこのノートの内容を表す20字以内の名前

JSONのみで返してください（説明文不要）。
形式: {"title":"ノートタイトル","body":"## 見出し1\n内容...\n\n## 見出し2\n内容..."}`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const m = text.match(/\{[\s\S]*\}/)
    if (!m) return Response.json({ error: 'パース失敗' }, { status: 500 })
    return Response.json(JSON.parse(m[0]))
  } catch (e: any) {
    return Response.json({ error: e?.message ?? '合成失敗' }, { status: 500 })
  }
}
