"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp, ImageDown, Share2, Trash2 } from "lucide-react"
import { LottoReceiptView } from "@/components/LottoReceiptView"
import html2canvas from "html2canvas"
import { LottoActionButtons } from "@/components/LottoActionButtons"
import { useLottoCapture } from "@/hooks/useLottoCapture"

interface SavedLotto {
  id: number
  date: string
  sets: number[][]
}

export default function LottoSavingPage() {
  const [saved, setSaved] = useState<SavedLotto[]>([])
  const [openId, setOpenId] = useState<number | null>(null)
  const now = new Date()
  const receiptRef = useRef<HTMLDivElement>(null)
  const { downloadImage, shareImage } = useLottoCapture(receiptRef)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedLotto") || "[]")
    setSaved(data)
  }, [])

  const toggleOpen = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const handleDelete = (id: number) => {
    const filtered = saved.filter((item) => item.id !== id)
    setSaved(filtered)
    localStorage.setItem("savedLotto", JSON.stringify(filtered))
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4 mb-16">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">저장한 번호</h2>
          <p className="text-sm text-gray-500">
            남겨 놓고 나중에 1등이 되는지 확인해봐요!
          </p>
        </div>

        {saved.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            저장된 번호가 없습니다.
          </p>
        )}

        {saved.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleOpen(item.id)}
            >
              <div>
                <p className="text-sm font-semibold">저장일: {item.date}</p>
              </div>

              {openId === item.id ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>

            {openId === item.id && (
              <div className="mt-3 space-y-4">
                <div ref={receiptRef}>
                  <LottoReceiptView timestamp={item.date} lottoSets={item.sets} />
                </div>
                <LottoActionButtons
                  onDownload={downloadImage}
                  onShare={shareImage}
                  onDelete={() => handleDelete(item.id)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}