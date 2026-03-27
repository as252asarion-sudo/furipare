import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'フリパレ | フリーランス書類管理',
    template: '%s | フリパレ',
  },
  description: 'フリーランス・副業ワーカーのための見積書・請求書・契約書を無料で一括管理。源泉徴収対応・PDF出力付き。',
  metadataBase: new URL('https://furipare.com'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://furipare.com',
    siteName: 'フリパレ',
    title: 'フリパレ | フリーランス書類管理',
    description: 'フリーランス・副業ワーカーのための見積書・請求書・契約書を無料で一括管理。源泉徴収対応・PDF出力付き。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'フリパレ | フリーランス書類管理',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'フリパレ | フリーランス書類管理',
    description: 'フリーランス・副業ワーカーのための見積書・請求書・契約書を無料で一括管理。',
    images: ['/og-image.png'],
  },
  verification: {
    google: ['eU9JpJEXOvnz11j1k5dK1LyOPoAmpb8LAD1_bO3D-Dw', 'E59frcjsHpxf7C10foNZg7C2At9wVhhJoBHWcWexbJ8'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full">
        {children}
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
