"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { LottoReceipt } from "@/components/LottoReceipt"
import { LatestResults } from "@/components/LatestResults"
// import KakaoAd320x50 from "@/components/KakaoAd320x50"
// import KakaoAd320x100 from "@/components/KakaoAd320x100"

export default function Home() {
  const [lottoSets, setLottoSets] = useState<number[][]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const generateButtonRef = useRef<HTMLButtonElement>(null)

  // 새 번호가 생성되면 영수증과 생성 버튼이 함께 보이도록 버튼을 화면 하단에 맞춤
  useEffect(() => {
    if (lottoSets.length > 0) {
      generateButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [lottoSets])

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
    <div className="py-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        {/* <KakaoAd320x50 /> */}
        <h1 className="sr-only">로또 6/45 번호 생성기</h1>
        <LatestResults />
        {lottoSets.length > 0 && <LottoReceipt lottoSets={lottoSets} />}
        <Button
          ref={generateButtonRef}
          onClick={generateLottoNumbers}
          disabled={isGenerating}
          className="w-full h-12 text-base font-mono scroll-mb-4"
          size="lg"
        >
          {isGenerating ? "생성 중..." : "번호 생성하기"}
        </Button>
        {/* <KakaoAd320x100 /> */}
      </div>
    </div>
  )
}