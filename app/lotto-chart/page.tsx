"use client"
import LottoFrequencyChart from "@/components/LottoFrequencyChart"
import KakaoAd from "@/components/KakaoAd320x50"
import KakaoAd2 from "@/components/KakaoAd320x100"
import KakaoAd320x100 from "@/components/KakaoAd320x100"
import KakaoAd320x50 from "@/components/KakaoAd320x50"

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 px-4 mb-16">
      <div className="max-w-md mx-auto space-y-6">
        <KakaoAd320x50 />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">로또 번호 분석</h2>
          <p className="text-sm text-muted-foreground">최근 5회차 당첨번호 출현 빈도 분석</p>
        </div>
        <LottoFrequencyChart />
        <KakaoAd320x100 />
      </div>
    </main>
  )
}