/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
      {
        source: '/materia.html',
        destination: '/api/og/materia',
      },
    ]
  },
}
export default nextConfig;
