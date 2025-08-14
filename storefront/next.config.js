/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: 'http://localhost:9000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
