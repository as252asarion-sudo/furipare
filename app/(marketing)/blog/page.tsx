import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'フリーランスお役立ちブログ | フリパレ',
  description:
    'フリーランス・副業ワーカーに役立つ情報を発信。請求書・見積書の書き方、契約書の選び方、フリーランス新法対応など実務に使える記事を掲載しています。',
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${year}年${parseInt(month)}月${parseInt(day)}日`
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-brand-primary tracking-tight">
            フリパレ
          </Link>
          <Link
            href="/dashboard"
            className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
          >
            無料で使う
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[720px] mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-neutral-900 leading-snug mb-2">ブログ</h1>
        <p className="text-neutral-500 text-base mb-12">
          フリーランス・副業ワーカーに役立つ実務情報を発信しています。
        </p>

        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block group rounded-lg border border-neutral-200 hover:border-brand-primary transition-colors p-6"
              >
                <p className="text-xs text-neutral-400 mb-2">{formatDate(post.publishedAt)}</p>
                <h2 className="text-lg font-bold text-neutral-900 group-hover:text-brand-primary transition-colors leading-snug mb-3">
                  {post.title}
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed">{post.description}</p>
                <span className="inline-block mt-4 text-xs font-medium text-brand-primary">
                  続きを読む →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8 mt-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-neutral-400">
          <span className="font-semibold text-brand-primary">フリパレ</span>
          <p>&copy; 2026 ウラヤハカンパニー</p>
        </div>
      </footer>
    </div>
  )
}
