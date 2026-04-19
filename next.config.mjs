/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
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
    ]
  },
}
export default nextConfig;
