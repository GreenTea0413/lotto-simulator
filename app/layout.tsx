import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '로또 시뮬레이션 - 당신의 행운을 예측하세요!',
  description: '이름이나 생년월일로 로또 번호를 추천받고, 재미로 즐겨보세요. 매주 바뀌는 운세와 숫자 추천!',
  generator: 'Next.js',
  keywords: ['로또', '로또 번호', '로또 시뮬레이션', '랜덤 추천', '행운의 숫자'],
  authors: [{ name: '보성 김' }],
  creator: '보성 김',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  openGraph: {
    title: '로또 시뮬레이션 - 당신의 행운을 예측하세요!',
    description: '이름이나 생년월일로 로또 번호를 추천받고, 재미로 즐겨보세요.',
    url: 'https://lotto-simm.vercel.app', // ← 실제 배포 주소
    siteName: '로또 시뮬레이션',
    images: [
      {
        url: '/icon-192x192.png', // 1200x630 추천
        width: 1200,
        height: 630,
        alt: '로또 시뮬레이션 대표 이미지',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
