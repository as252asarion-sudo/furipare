import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPost, getAllBlogPosts } from '@/lib/blog'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {}
  }

  return {
    title: `${post.title} | フリパレ`,
    description: post.description,
  }
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${year}年${parseInt(month)}月${parseInt(day)}日`
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

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

      {/* Article */}
      <main className="max-w-[720px] mx-auto px-6 py-16">
        <p className="text-sm text-neutral-400 mb-4">{formatDate(post.publishedAt)}</p>
        <h1 className="text-3xl font-bold text-neutral-900 leading-snug mb-6">{post.title}</h1>
        <p className="text-neutral-500 text-base leading-relaxed mb-10 border-l-4 border-brand-primary pl-4">
          {post.description}
        </p>

        <div
          className="prose prose-slate max-w-none text-base leading-relaxed
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-neutral-800 [&_h2]:mt-10 [&_h2]:mb-4
            [&_p]:text-neutral-600 [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-neutral-600
            [&_li]:mb-2
            [&_strong]:text-neutral-800 [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-16 bg-brand-subtle border border-brand-muted rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-neutral-900 mb-3">
            請求書・見積書の管理はフリパレで
          </h2>
          <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
            フリーランス・副業ワーカーのための無料書類管理ツール。源泉徴収の自動計算・PDF出力対応。登録不要ですぐ使えます。
          </p>
          <Link
            href="/dashboard"
            className="bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-3 rounded-md transition-colors inline-block"
          >
            フリパレを無料で使う
          </Link>
        </div>
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
