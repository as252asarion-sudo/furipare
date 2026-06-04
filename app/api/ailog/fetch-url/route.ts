import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export type FetchUrlResult =
  | { type: 'gemini'; conversations: Array<{ question: string; answer: string }> }
  | { type: 'unsupported'; message: string }
  | { error: string }

function parseGemini(html: string): Array<{ question: string; answer: string }> {
  const m = html.match(/"DnVkpd":"(.*?)","/)
  if (!m) return []

  // JSON エスケープを解除
  const raw = JSON.parse('"' + m[1] + '"') as string

  // ∰ (U+2230) でターンを分割
  const turns = raw.split('∰').filter(Boolean)

  return turns.flatMap((turn) => {
    // ∞ (U+221E) でパーツを分割し、画像URLを除外
    const parts = turn.split('∞').map((p) => p.trim()).filter((p) => p && !p.startsWith('http'))
    if (parts.length < 2) return []
    const question = parts[0]
    const answer = parts[parts.length - 1]
    return question && answer ? [{ question, answer }] : []
  })
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json() as { url: string }

    if (!url?.startsWith('https://')) {
      return Response.json({ error: 'https:// で始まるURLを入力してください' }, { status: 400 })
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      return Response.json({ error: `フェッチ失敗: ${res.status} ${res.statusText}` }, { status: 502 })
    }

    const html = await res.text()

    if (url.includes('gemini.google.com/share/')) {
      const conversations = parseGemini(html)
      if (conversations.length > 0) {
        return Response.json({ type: 'gemini', conversations })
      }
      return Response.json({ error: 'Geminiの会話テキストを取得できませんでした' }, { status: 422 })
    }

    return Response.json({
      type: 'unsupported',
      message: 'ChatGPT・Claudeの共有リンクはサポート外です。Geminiの共有リンクをお使いください。',
    })
  } catch (e: any) {
    return Response.json({ error: e?.message ?? 'フェッチ失敗' }, { status: 500 })
  }
}
