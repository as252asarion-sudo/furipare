import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export type FetchUrlResult =
  | { type: 'gemini'; conversations: Array<{ question: string; answer: string }> }
  | { type: 'youtube'; title: string; transcript: string }
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

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function extractYoutubeVideoId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)
  return m ? m[1] : null
}

async function fetchYoutubeTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return '無題の動画'
    const data = await res.json() as { title?: string }
    return data.title ? decodeEntities(data.title) : '無題の動画'
  } catch {
    return '無題の動画'
  }
}

// 字幕取得はSupadata(https://supadata.ai)経由。YouTube公式のtimedtext/InnerTube APIは
// PoToken必須化により非公式スクレイピングでは取得不能になったため（2026-07検証済み）。
async function fetchYoutubeTranscript(videoId: string): Promise<{ title: string; transcript: string } | { error: string }> {
  const apiKey = process.env.SUPADATA_API_KEY
  if (!apiKey) {
    return { error: '字幕取得機能が設定されていません' }
  }

  const title = await fetchYoutubeTitle(videoId)

  const res = await fetch(`https://api.supadata.ai/v1/transcript?url=https://www.youtube.com/watch?v=${videoId}`, {
    headers: { 'x-api-key': apiKey },
    signal: AbortSignal.timeout(15000),
  })

  if (res.status === 404) {
    return { error: 'この動画には字幕が見つかりませんでした' }
  }
  if (!res.ok) {
    return { error: `字幕データの取得に失敗しました: ${res.status}` }
  }

  const data = await res.json() as { content?: Array<{ text: string }> }
  const transcript = (data.content ?? []).map((c) => c.text).join(' ').replace(/\s+/g, ' ').trim()

  if (!transcript) {
    return { error: 'この動画には字幕が見つかりませんでした' }
  }

  return { title, transcript }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json() as { url: string }

    if (!url?.startsWith('https://')) {
      return Response.json({ error: 'https:// で始まるURLを入力してください' }, { status: 400 })
    }

    const videoId = extractYoutubeVideoId(url)
    if (videoId) {
      const result = await fetchYoutubeTranscript(videoId)
      if ('error' in result) {
        return Response.json({ error: result.error }, { status: 422 })
      }
      return Response.json({ type: 'youtube', ...result })
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
