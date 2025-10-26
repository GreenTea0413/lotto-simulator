import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '로또 시뮬레이션 - 당신의 행운을 예측하세요!',
  description: '이름이나 생년월일로 로또 번호를 추천받고, 재미로 즐겨보세요.',
  metadataBase: new URL('https://lotto-simm.vercel.app'),
  keywords: ['로또', '번호 추천', '행운', '시뮬레이터', '로또심', '로또 시뮬'],
  openGraph: {
    title: '로또 시뮬레이션',
    description: '랜덤 추천, 위치 기반 명소와 함께하는 행운 테스트',
    url: 'https://lotto-simm.vercel.app',
    siteName: '로또 시뮬레이터',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: '로또 시뮬레이터 대표 이미지',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'lcnJKA7vmJdAeeH_r_Sj_uWnJt-qj0_kyd5Om9o3imA', // ✅ Google site verification
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <script
          type="text/javascript"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
        ></script>
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}