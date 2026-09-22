"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LottoReceipt } from "@/components/LottoReceipt"

export function LottoGenerator() {
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

  return lottoSets.length > 0 ? (
    <LottoReceipt lottoSets={lottoSets} onGenerate={generateLottoNumbers} />
  ) : (
    <Button
      onClick={generateLottoNumbers}
      disabled={isGenerating}
      className="w-full h-12 text-base font-mono"
      size="lg"
    >
      {isGenerating ? "생성 중..." : "번호 생성하기"}
    </Button>
  )
}
