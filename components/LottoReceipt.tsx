"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LottoReceiptView } from "./LottoReceiptView"
import { LottoActionButtons } from "./LottoActionButtons"
import { useLottoCapture } from "@/hooks/ui/useLottoCapture"

interface LottoReceiptProps {
  lottoSets: number[][]
  onGenerate: () => void
}

export function LottoReceipt({ lottoSets, onGenerate }: LottoReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { downloadImage, shareImage } = useLottoCapture(receiptRef)
  const router = useRouter()

  // 새 번호가 생성되면 버튼 줄이 하단 고정 내비(LottoNav) 위에 보이도록 스크롤
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [lottoSets])

  const timestamp =
    new Date().toLocaleDateString("ko-KR") +
    " " +
    new Date().toLocaleTimeString("ko-KR", { hour12: false })

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("savedLotto") || "[]")
    const newEntry = { id: Date.now(), date: timestamp, sets: lottoSets }
    localStorage.setItem("savedLotto", JSON.stringify([...saved, newEntry]))
    toast.success("번호를 저장했어요", {
      action: { label: "내 번호 보기", onClick: () => router.push("/lotto-saving") },
    })
  }

  return (
    <div ref={containerRef} className="scroll-mb-28" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div ref={receiptRef}>
        <LottoReceiptView lottoSets={lottoSets} />
      </div>
      <LottoActionButtons
        onDownload={downloadImage}
        onShare={shareImage}
        onSave={handleSave}
        onGenerate={onGenerate}
      />
    </div>
  )
}