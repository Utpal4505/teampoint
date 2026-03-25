import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      {
        protocol: 'https',
        hostname: 'pub-3b06306c40a64cd9bf9e22092a36f879.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
