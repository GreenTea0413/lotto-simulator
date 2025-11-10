"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LottoReceipt } from "@/components/LottoReceipt"
import { LatestResults } from "@/components/LatestResults"
import KakaoAd from "@/components/KakaoAd"

export default function Home() {
  const [lottoSets, setLottoSets] = useState<number[][]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateLottoNumbers = () => {
    setIsGenerating(true)

    setTimeout(() => {
      const newSets: number[][] = []

      for (let i = 0; i < 5; i++) {
        const numbers = new Set<number>()
        while (numbers.size < 6) {
          numbers.add(Math.floor(Math.random() * 45) + 1)
        }
        newSets.push(Array.from(numbers).sort((a, b) => a - b))
      }

      setLottoSets(newSets)
      setIsGenerating(false)
    }, 500)
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4 mb-16">
      <div className="max-w-md mx-auto space-y-8">
        <KakaoAd />
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground font-mono">로또 6/45</h1>
          <p className="text-sm text-muted-foreground">1등만이 답이다</p>
        </div>
        <LatestResults />
        <Button
          onClick={generateLottoNumbers}
          disabled={isGenerating}
          className="w-full h-12 text-base font-mono"
          size="lg"
        >
          {isGenerating ? "생성 중..." : "번호 생성하기"}
        </Button>
        {lottoSets.length > 0 && <LottoReceipt lottoSets={lottoSets} />}
      </div>
    </main>
  )
}