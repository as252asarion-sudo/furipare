import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Receipt, ScrollText, CheckCircle, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'フリパレ | フリーランスの書類管理をシンプルに',
  description: 'フリーランス・副業ワーカー向けの書類管理ツール。見積書・請求書・契約書を一括管理。源泉徴収対応。無料プランあり。',
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
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: 'JPY', name: '無料プラン' },
      { '@type': 'Offer', price: '1980', priceCurrency: 'JPY', name: 'アドバンスプラン' },
    ],
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
            無料ではじめる
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
          見積書・請求書・契約書を一括管理。フリーランスに必要な書類業務を、ブラウザひとつで完結。無料プランから始められます。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-indigo-200"
          >
            無料ではじめる
          </Link>
          <a
            href="#pricing"
            className="border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            料金を見る
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
              { title: '無料プランあり', desc: 'クレジットカード不要で無料プランからスタート。仕事が増えてきたらアドバンスプランへ。' },
              { title: '源泉徴収対応', desc: 'フリーランスの請求書に必要な源泉徴収税額を自動計算。正確な金額で請求できます。' },
              { title: 'PDF出力', desc: '見積書・請求書・契約書をすぐにPDFとして出力。クライアントへの送付がスムーズです。' },
              { title: 'ブラウザだけで完結', desc: 'インストール不要。ブラウザさえあればどこでも使えます。' },
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

      {/* Pricing */}
      <section id="pricing" className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            シンプルな2プラン
          </h2>
          <p className="text-slate-500 text-center mb-14 max-w-xl mx-auto">
            まず無料ではじめて、必要になったらアップグレード。縛りなし、面倒なし。
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-1">無料プラン</h3>
              <div className="text-3xl font-bold text-slate-900 mb-6">
                ¥0 <span className="text-base font-normal text-slate-400">/ 月</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" />請求書 3件／月</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" />見積書 3件／月</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" />契約書 1件／月</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" />取引先 3社まで</li>
              </ul>
              <Link
                href="/dashboard"
                className="block text-center border border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                無料ではじめる
              </Link>
            </div>
            {/* Advance Plan */}
            <div className="bg-indigo-600 rounded-2xl p-8 relative">
              <span className="absolute top-4 right-4 bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">おすすめ</span>
              <h3 className="text-lg font-bold text-white mb-1">アドバンス</h3>
              <div className="text-3xl font-bold text-white mb-6">
                ¥1,980 <span className="text-base font-normal text-indigo-200">/ 月</span>
              </div>
              <ul className="space-y-3 text-sm text-indigo-100 mb-8">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-300" />請求書・見積書・契約書、すべて無制限</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-300" />取引先、何社でも</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-300" />1件の仕事で元が取れる金額</li>
              </ul>
              <Link
                href="/dashboard"
                className="block text-center bg-white hover:bg-slate-50 text-indigo-700 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                アドバンスにアップグレード
              </Link>
            </div>
          </div>
          <p className="text-center text-sm text-slate-400 mt-6">クレジットカード不要で無料プランをはじめられます。アドバンスプランはいつでもキャンセル可能。</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            まず無料ではじめる
          </h2>
          <p className="text-indigo-200 mb-10 max-w-xl mx-auto">
            ブラウザを開いてすぐ使える、フリーランスのための書類管理ツールです。
          </p>
          <Link
            href="/dashboard"
            className="bg-white hover:bg-slate-50 text-indigo-700 font-bold px-10 py-4 rounded-xl text-lg inline-block transition-colors shadow-lg"
          >
            無料ではじめる
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
          <div className="flex items-center gap-4">
            <Link href="/legal/tokusho" className="hover:text-slate-600 transition-colors">特定商取引法に基づく表記</Link>
            <p>&copy; 2025 ウラヤハカンパニー</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
