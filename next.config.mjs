/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isBot = [
      {
        type: 'header',
        key: 'user-agent',
        value: '.*([Gg]ooglebot|[Gg]oogle-[Ii]nspection[Tt]ool|[Bb]ingbot|[Yy]andex|[Ff]acebookexternalhit|[Ww]hats[Aa]pp|[Tt]witterbot|[Ll]inked[Ii]n[Bb]ot|[Aa]pplebot|[Dd]uck[Dd]uck[Bb]ot|[Ss]lurp).*',
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
