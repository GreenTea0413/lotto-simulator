"use client"

import { LottoBall } from "./lotto-ball"
import { useRef } from "react"
import html2canvas from "html2canvas"
import { Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LottoReceiptProps {
  lottoSets: number[][]
}

export function LottoReceipt({ lottoSets }: LottoReceiptProps) {
  const now = new Date()
  const receiptRef = useRef<HTMLDivElement>(null)

  const formattedDate = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  const formattedTime = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  const captureImageBlob = async () => {
    if (!receiptRef.current) return null
    const canvas = await html2canvas(receiptRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    })
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
  }

  const handleDownload = async () => {
    const blob = await captureImageBlob()
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lotto-receipt-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const blob = await captureImageBlob()
    if (!blob) return
    const file = new File([blob], "lotto-receipt.png", { type: "image/png" })

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: "나의 로또 번호",
          text: "이번 주 대박 번호!",
          files: [file],
        })
      } catch (err) {
        console.error("공유 취소 또는 실패", err)
      }
    } else {
      alert("이 기기에서는 공유 기능을 지원하지 않습니다.")
    }
  }

  return (
    <div className="space-y-4">
      <div
        ref={receiptRef}
        className="bg-card border-2 border-dashed border-border rounded-sm shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {/* 헤더 */}
        <div className="bg-primary text-primary-foreground px-4 py-3 text-center">
          <div className="font-mono text-xs tracking-wider">LOTTO 6/45</div>
          <div className="font-bold text-lg mt-1">로또 복권</div>
        </div>

        {/* 영수증 정보 */}
        <div className="px-4 py-3 border-b border-dashed border-border">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>{formattedDate}</span>
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* 번호 목록 */}
        <div className="px-4 py-4 space-y-4">
          {lottoSets.map((numbers, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">{String.fromCharCode(65 + index)}</span>
                <div className="flex-1 mx-3 border-t border-dotted border-border" />
                <span className="text-xs font-mono text-muted-foreground">자동</span>
              </div>
              <div className="flex gap-2 justify-center">
                {numbers.map((number, numIndex) => (
                  <LottoBall key={numIndex} number={number} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <div className="px-4 py-3 border-t border-dashed border-border bg-muted/30">
          <div className="text-center space-y-1">
            <div className="text-xs font-mono text-muted-foreground">총 5게임 | 금액 5,000원</div>
            <div className="text-[10px] text-muted-foreground">행운을 빕니다!</div>
          </div>
        </div>

        {/* 영수증 하단 톱니 효과 */}
        <div className="h-3 bg-background relative">
          <div className="absolute inset-0 flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-card"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleDownload} variant="outline" size="lg" className="w-full font-semibold bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          이미지 저장
        </Button>
        <Button onClick={handleShare} size="lg" className="w-full font-semibold">
          <Share2 className="w-4 h-4 mr-2" />
          공유하기
        </Button>
      </div>
    </div>
  )
}
