import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/estimates/',
          '/invoices/',
          '/contracts/',
          '/clients/',
          '/settings/',
        ],
      },
    ],
    sitemap: 'https://furipare.com/sitemap.xml',
  }
}
