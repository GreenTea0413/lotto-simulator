/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' https://dapi.kakao.com 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src * blob: data:;
              connect-src *;
              font-src 'self' https://fonts.gstatic.com;
              frame-src *;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ]
  },
}

export default nextConfig