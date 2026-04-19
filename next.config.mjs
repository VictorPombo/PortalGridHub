/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isBot = [
      {
        type: 'header',
        key: 'user-agent',
        value: '(?i).*(Googlebot|Google-InspectionTool|Googlebot-Image|bingbot|YandexBot|DuckDuckBot|Baiduspider|Applebot|facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slurp|Pinterest).*',
      }
    ];

    return [
      {
        source: '/robots.txt',
        destination: '/robots.txt',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
      {
        source: '/',
        destination: '/index.html',
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
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.drivernews.com.br' }],
        destination: 'https://drivernews.com.br/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.drivernews.com.br:3000' }],
        destination: 'https://drivernews.com.br/:path*',
        permanent: true,
      },
    ];
  },
}
export default nextConfig;
