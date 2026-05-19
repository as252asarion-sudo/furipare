export const runtime = 'nodejs'

export async function GET() {
  return Response.json({
    ok: true,
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    keyPrefix: process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.slice(0, 14) + '...' : null,
  })
}
