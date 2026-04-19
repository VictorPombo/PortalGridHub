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
}
export default nextConfig;
