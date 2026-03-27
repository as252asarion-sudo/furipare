import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'フリパレ | フリーランス書類管理',
  description: 'フリーランス・副業ワーカーのための見積・請求・契約書SaaS by ウラヤハカンパニー',
  verification: {
    google: 'eU9JpJEXOvnz11j1k5dK1LyOPoAmpb8LAD1_bO3D-Dw',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full flex bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-X8NCTTM1B5"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-X8NCTTM1B5');
        `}
      </Script>
    </html>
  )
}
