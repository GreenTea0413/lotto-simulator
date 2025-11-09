"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Trash2 } from "lucide-react"
import { LottoReceiptView } from "@/components/LottoReceiptView"
import { LottoActionButtons } from "@/components/LottoActionButtons"
import { useLottoCapture } from "@/hooks/useLottoCapture"
import { LottoBall } from "@/components/LottoBall"
import { Card } from "@/components/ui/card"

interface SavedLotto {
  id: number
  date: string
  sets: number[][]
}

interface LottoResult {
  round: number
  date: string
  numbers: number[]
  bonus: number
}

const PAGE_SIZE = 10

export default function LottoSavingPage() {
  const [saved, setSaved] = useState<SavedLotto[]>([])
  const [openId, setOpenId] = useState<number | null>(null)
  const [roundOptions, setRoundOptions] = useState<number[]>([])
  const [selectedRound, setSelectedRound] = useState<number | null>(null)
  const [winning, setWinning] = useState<LottoResult | null>(null)

  const [page, setPage] = useState(1)

  const receiptRef = useRef<HTMLDivElement>(null)
  const { downloadImage, shareImage } = useLottoCapture(receiptRef)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedLotto") || "[]")
    setSaved(data)
  }, [])

  useEffect(() => {
    fetch("/api/lotto/latest")
      .then(res => res.json())
      .then((data: LottoResult) => {
        const latest = data.round
        const options = Array.from({ length: 20 }, (_, i) => latest - 19 + i)
        setRoundOptions(options)
        setSelectedRound(latest)
        setWinning(data)
      })
  }, [])

  useEffect(() => {
    if (!selectedRound) return
    fetch(`/api/lotto/${selectedRound}`)
      .then(res => res.json())
      .then((data: LottoResult) => {
        setWinning(data)
      })
  }, [selectedRound])

  const toggleOpen = (id: number) => {
    setOpenId(prev => (prev === id ? null : id))
  }

  const handleDelete = (id: number) => {
    const filtered = saved.filter(item => item.id !== id)
    setSaved(filtered)
    localStorage.setItem("savedLotto", JSON.stringify(filtered))
  }

  const handleDeleteAll = () => {
    if (confirm("저장된 모든 번호를 삭제하시겠습니까?")) {
      setSaved([])
      localStorage.removeItem("savedLotto")
      setOpenId(null)
      setPage(1)
    }
  }

  const getBorderColor = (set: number[]) => {
    if (!winning) return "border-gray-200"
    const match = set.filter(num => winning.numbers.includes(num)).length
    const bonusMatch = set.includes(winning.bonus)
    if (match === 6) return "border-yellow-400"
    if (match === 5 && bonusMatch) return "border-gray-400"
    if (match === 5) return "border-orange-500"
    return "border-gray-200"
  }

  const paginated = saved.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(saved.length / PAGE_SIZE)

  return (
    <main className="min-h-screen bg-background py-8 px-4 mb-16">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">저장한 번호</h2>
          <p className="text-sm text-gray-500">회차별 당첨 결과를 확인해보세요!</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end">
            <select
              className="border px-2 py-1 rounded text-sm"
              value={selectedRound ?? ""}
              onChange={(e) => setSelectedRound(parseInt(e.target.value))}
            >
              {roundOptions.map(round => (
                <option key={round} value={round}>{round}회차</option>
              ))}
            </select>
          </div>

          {winning && (
            <Card className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold font-mono">당첨번호</h2>
                  <span className="text-xs text-muted-foreground font-mono">제 {winning.round}회</span>
                </div>
                <div className="flex gap-2 justify-center items-center">
                  {winning.numbers.map((number, index) => (
                    <LottoBall key={index} number={number} />
                  ))}
                  <span className="text-muted-foreground mx-1">+</span>
                  <LottoBall number={winning.bonus} />
                </div>
              </div>
            </Card>
          )}
        </div>

        {saved.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">저장된 번호가 없습니다.</p>
        ) : (
          <div className="min-h-[740px] flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {paginated.map((item) => {
                const borderClass = item.sets.reduce((best, set) => {
                  const current = getBorderColor(set)
                  return current === "border-yellow-400" ? current
                    : best === "border-yellow-400" ? best
                    : current === "border-gray-400" ? current
                    : best === "border-gray-400" ? best
                    : current === "border-orange-500" ? current
                    : best
                }, "border-gray-200")

                return (
                  <Card key={item.id} className={`p-4 ${borderClass}`}>
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleOpen(item.id)}>
                      <p className="text-sm font-semibold">저장일: {item.date}</p>
                      {openId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    {openId === item.id && (
                      <div className="mt-3 space-y-4">
                        <div ref={receiptRef}>
                          <LottoReceiptView timestamp={item.date} lottoSets={item.sets} getBorderColor={getBorderColor} />
                        </div>
                        <LottoActionButtons onDownload={downloadImage} onShare={shareImage} onDelete={() => handleDelete(item.id)} />
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
            <div className="relative pt-2 min-h-[40px]">
              {/* 페이지네이션 버튼 중앙 정렬 */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="disabled:opacity-30"
                >
                  <ChevronLeft />
                </button>
                <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="disabled:opacity-30"
                >
                  <ChevronRight />
                </button>
              </div>

              {/* 전체 삭제 버튼 오른쪽 */}
              <button
                onClick={handleDeleteAll}
                className="absolute right-0 text-sm text-red-500 hover:underline flex flex-row items-center gap-1"
              >
                <Trash2 size={14} />
                전체 삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
