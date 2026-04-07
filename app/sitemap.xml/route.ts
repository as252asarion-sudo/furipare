import { getAllBlogPosts } from '@/lib/blog'

const BASE_URL = 'https://www.furipare.com'

export async function GET() {
  const posts = getAllBlogPosts()

  const blogUrls = posts
    .map(
      (post) => `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>${BASE_URL}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>${blogUrls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
