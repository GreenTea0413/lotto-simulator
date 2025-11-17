import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import LottoNav from '@/components/LottoNav'
import Script from 'next/script'
import { Providers } from './providers'
import KakaoAd160x600Left from '@/components/KakaoAd160x600Left'
import KakaoAd160x600Right from '@/components/KakaoAd160x600Right'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LottoSimm 로또 시뮬레이션 - 주변의 명당도 찾아줘요! 당신의 행운을 예측하세요!',
  description: 'LottoSimm 로또 번호를 추천받고, 로또 1등 당첨된 명당을 지도에서 확인하고, 내 위치 주변 명당도 찾을 수 있어요! 1등 당첨의 행운을 경험해보세요!',
  metadataBase: new URL('https://lottosimm.vercel.app'),
  keywords: ['LottoSimm','lottosimm','로또', '번호 추천', '행운', '시뮬레이터', '로또심', '로또 시뮬','로또 명당', '로또 지도', '로또 1등', '로또 시뮬레이션', '명당 복권방', '로또 판매점'],
  openGraph: {
    title: 'LottoSimm 로또 시뮬레이션',
    description: 'LottoSimm 랜덤 추천, 위치 기반 명소와 함께하는 행운 테스트',
    url: 'https://lottosimm.vercel.app',
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
        {process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
        )}

        {process.env.NEXT_PUBLIC_NAVER_VERIFICATION && (
          <meta name="naver-site-verification" content={process.env.NEXT_PUBLIC_NAVER_VERIFICATION} />
        )}

        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
            <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_ID} />
        )}
        <Script
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="afterInteractive"
        />
      </head>

      <body className="font-sans antialiased bg-gray-50">
        <Providers>
          <div className="flex justify-center min-h-screen">
            {/* 왼쪽 사이드 광고 (PC only - 1280px 이상) */}
            <aside className="hidden xl:block fixed left-0 top-0 h-screen p-4 z-10">
              <div className="sticky top-4">
                <KakaoAd160x600Left />
              </div>
            </aside>

            {/* 메인 콘텐츠 (모바일 중심 max-w-md) */}
            <main className="w-full max-w-md mx-auto xl:mx-0">
              {children}
              <Analytics />
              <LottoNav />
            </main>

            {/* 오른쪽 사이드 광고 (PC only - 1280px 이상) */}
            <aside className="hidden xl:block fixed right-0 top-0 h-screen p-4 z-10">
              <div className="sticky top-4">
                <KakaoAd160x600Right />
              </div>
            </aside>
          </div>
        </Providers>
      </body>
    </html>
  )
}