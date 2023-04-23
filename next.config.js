/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/',
        destination: 'http://127.0.0.1:5000/playlist',
      },
    ]
  },
  env: {
    API_URL: 'http://axenet.tplinkdns.com:5000',
  }
  
}

module.exports = nextConfig
