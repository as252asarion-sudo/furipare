import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Receipt, ScrollText, CheckCircle, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'フリパレ | フリーランスの書類管理を無料で',
  description: 'フリーランス・副業ワーカー向けの書類管理ツール。見積書・請求書・契約書を一括管理。源泉徴収対応・完全無料。',
}

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'フリパレ',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'フリーランス・副業ワーカーのための見積書・請求書・契約書SaaS',
    url: 'https://furipare.com',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={22} className="text-indigo-600" />
            <span className="font-bold text-xl text-indigo-700 tracking-tight">フリパレ</span>
          </div>
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            無料で使う
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="text-indigo-600 text-sm font-semibold tracking-wide uppercase mb-4">
          フリーランス・副業ワーカー向け
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
          フリーランスの書類管理を、<br className="hidden md:block" />もっとシンプルに。
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
          見積書・請求書・契約書を一括管理。フリーランス 書類管理のベストプラクティスを、ブラウザひとつで完結。源泉徴収対応・完全無料でご利用いただけます。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-indigo-200"
          >
            無料で使う
          </Link>
          <a
            href="#features"
            className="border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            機能を見る
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            見積書・請求書・契約書を一括管理
          </h2>
          <p className="text-slate-500 text-center mb-14 max-w-xl mx-auto">
            フリーランスに必要な書類をすべてフリパレで。書類ごとに別のツールを使う手間はもうありません。
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-md transition-shadow">
              <div className="bg-violet-100 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                <FileText size={22} className="text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">見積書</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                プロジェクトの見積書を素早く作成。税率・源泉徴収も自動計算。クライアントごとに管理できます。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                <Receipt size={22} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">請求書</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                請求書の発行・入金管理をまとめて。支払期日の管理や入金ステータスの追跡も簡単です。
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                <ScrollText size={22} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">契約書</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                業務委託契約書をデジタルで管理。過去の契約を一覧で確認でき、契約内容の把握に役立ちます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Points */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            フリパレが選ばれる理由
          </h2>
          <p className="text-slate-500 text-center mb-14 max-w-xl mx-auto">
            フリーランス・副業ワーカーの実務を考えた機能が揃っています。
          </p>
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {[
              { title: '完全無料', desc: '登録不要・クレジットカード不要。すべての機能を無料でご利用いただけます。' },
              { title: '源泉徴収対応', desc: 'フリーランスの請求書に必要な源泉徴収税額を自動計算。正確な金額で請求できます。' },
              { title: 'PDF出力', desc: '見積書・請求書・契約書をすぐにPDFとして出力。クライアントへの送付がスムーズです。' },
              { title: 'ブラウザだけで完結', desc: 'インストール不要。ブラウザさえあればどこでも使えます。データはローカルに保存されます。' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-4 bg-slate-50 rounded-xl p-6 border border-slate-100">
                <CheckCircle size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            今すぐ無料で始める
          </h2>
          <p className="text-indigo-200 mb-10 max-w-xl mx-auto">
            登録不要。ブラウザを開いてすぐ使える、フリーランスのための書類管理ツールです。
          </p>
          <Link
            href="/dashboard"
            className="bg-white hover:bg-slate-50 text-indigo-700 font-bold px-10 py-4 rounded-xl text-lg inline-block transition-colors shadow-lg"
          >
            フリパレを無料で使う
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-indigo-400" />
            <span className="font-semibold text-indigo-500">フリパレ</span>
          </div>
          <p>&copy; 2025 ウラヤハカンパニー</p>
        </div>
      </footer>
    </div>
    </>
  )
}
