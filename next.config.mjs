/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isBot = [
      {
        type: 'header',
        key: 'user-agent',
        value: '(?i).*(Googlebot|Googlebot-Image|bingbot|YandexBot|DuckDuckBot|Baiduspider|Applebot|facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slurp|Pinterest).*',
      }
    ];

    return [
      {
        source: '/',
        destination: '/index.html',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/materia.html',
        has: isBot,
        destination: '/api/og/materia',
      },
      {
        source: '/piloto.html',
        has: isBot,
        destination: '/api/og/piloto',
      },
    ]
  },
}
export default nextConfig;
