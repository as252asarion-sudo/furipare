import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CATEGORIES = ['コード', '健康', '料理', '仕事', '学習', 'その他'] as const

export async function POST(request: NextRequest) {
  try {
    const { body } = await request.json() as { body: string }

    const bodyLength = body.length
    let lengthGuide: string
    let maxTokens: number
    if (bodyLength < 500) {
      lengthGuide = '2〜3文の文章で。見出しは不要'
      maxTokens = 512
    } else if (bodyLength < 2000) {
      lengthGuide = '4〜6文の文章で。見出しは不要'
      maxTokens = 768
    } else if (bodyLength < 6000) {
      lengthGuide = '6〜10文程度。内容が複数のトピックに分かれる場合のみ「## 見出し」で区切り、各見出しの下に文章または「- 」の箇条書きで書く'
      maxTokens = 1024
    } else {
      lengthGuide = '本文の情報量に見合った十分な文量で、読み物として読みやすいように「## 見出し」で章立てする。各見出しの下は文章と「- 」の箇条書きを使い分けて具体的な事実・数値を書く'
      maxTokens = 4096
    }

    // 長文・複数段落の要約はJSON文字列中の改行がエスケープされずJSON.parseに失敗することがあるため、
    // 生JSONをテキストで書かせず、tool useで構造化出力させる（SDKがJSONエンコードを保証する）
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      tools: [{
        name: 'submit_analysis',
        description: 'テキストの要約結果を送信する',
        input_schema: {
          type: 'object',
          properties: {
            // max_tokens到達時の途中切れで欠損しやすいフィールドを後ろに回すため、
            // 一番重要なsummaryを先頭に置く
            summary: { type: 'string', description: '要約本文' },
            title: { type: 'string', description: 'タイトル（20字以内）' },
            category: { type: 'string', enum: [...CATEGORIES] },
          },
          required: ['summary', 'title', 'category'],
        },
      }],
      tool_choice: { type: 'tool', name: 'submit_analysis' },
      messages: [{
        role: 'user',
        content: `以下はAIチャットの回答テキストです。このテキストから得られる「具体的な知識・事実・数値・ポイント」を抽出して、submit_analysisツールでタイトル・要約・カテゴリを送信してください。

【要約の書き方】
- 「〇〇について説明しています」「〇〇を紹介しています」のような内容紹介は禁止
- このテキストを読んで実際に得られる知識・事実・結論そのものを書く
- 具体的な数値・固有名詞・判断基準があれば必ず含める
- 人名・商品名などの固有名詞は本文中の表記をそのまま正確に書き写す（記憶や思い込みで別の字に置き換えない）
- 読んだ人が「何を学んだか」がわかる内容にする
- 本文の分量が多いほど、要約も情報を落とさず比例して詳しくする。分量の目安: ${lengthGuide}

テキスト:
${body}

カテゴリは必ず次の6つのどれかを選んでください: コード, 健康, 料理, 仕事, 学習, その他`,
      }],
    })

    const toolUse = response.content.find((b) => b.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') return Response.json({ error: 'パース失敗' }, { status: 500 })
    const result = toolUse.input as { title?: string; summary?: string; category?: string }
    // max_tokens到達などでtool useの引数が途中で切れた場合、フィールドが欠けたままDBのNOT NULL制約に違反しうるため防御的に埋める
    if (typeof result.summary !== 'string' || !result.summary) result.summary = body.slice(0, 200)
    if (typeof result.title !== 'string' || !result.title) result.title = ''
    if (!CATEGORIES.includes(result.category as (typeof CATEGORIES)[number])) result.category = 'その他'
    return Response.json(result)
  } catch (e: any) {
    console.error('ailog/analyze failed:', e)
    return Response.json({ error: e?.message ?? '解析失敗' }, { status: 500 })
  }
}
