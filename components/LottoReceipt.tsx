"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LottoReceiptView } from "./LottoReceiptView"
import { LottoActionButtons } from "./LottoActionButtons"
import { useLottoCapture } from "@/hooks/ui/useLottoCapture"

interface LottoReceiptProps {
  lottoSets: number[][]
}

export function LottoReceipt({ lottoSets }: LottoReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const { downloadImage, shareImage } = useLottoCapture(receiptRef)
  const router = useRouter()

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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div ref={receiptRef}>
        <LottoReceiptView timestamp={timestamp} lottoSets={lottoSets} />
      </div>
      <LottoActionButtons
        onDownload={downloadImage}
        onShare={shareImage}
        onSave={handleSave}
      />
    </div>
  )
}