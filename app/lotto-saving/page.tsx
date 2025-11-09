"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Crown, Trash2 } from "lucide-react"
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

const lottoRanks = [
  {
    label: "1등",
    color: "bg-yellow-400 border-yellow-400 text-yellow-500 shadow-md shadow-yellow-400"
  },
  {
    label: "2등",
    color: "bg-[#C7C7C7] border-[#C7C7C7] text-white shadow-md shadow-[#C7C7C7]"
  },
  {
    label: "3등",
    color: "bg-[#D2732C] border-[#D2732C] text-white shadow-md shadow-[#D2732C]"
  },
  {
    label: "4등",
    color: "bg-green-400 border-green-400"
  },
  {
    label: "5등",
    color: "bg-blue-400 border-blue-400"
  },
  {
    label: "꽝",
    color: "bg-gray-200 border-gray-100"
  }
]

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
      .then((data: LottoResult) => setWinning(data))
  }, [selectedRound])

  const getRank = (set: number[]) => {
    if (!winning) return "꽝"
    const match = set.filter(num => winning.numbers.includes(num)).length
    const bonusMatch = set.includes(winning.bonus)
    if (match === 6) return "1등"
    if (match === 5 && bonusMatch) return "2등"
    if (match === 5) return "3등"
    if (match === 4) return "4등"
    if (match === 3) return "5등"
    return "꽝"
  }

  const getRankColor = (rank: string) =>
    lottoRanks.find(r => r.label === rank)?.color.split(" ")[1] || "border-gray-200"

  const getCardBorder = (item: SavedLotto) => {
    const ranks = item.sets.map(getRank)
    const bestRank = ranks.sort(
      (a, b) =>
        lottoRanks.findIndex(r => r.label === a) - lottoRanks.findIndex(r => r.label === b)
    )[0]
    return getRankColor(bestRank)
  }

  const getOverallBestRank = () => {
    if (!saved.length || !winning) return "등수없음"
    const allRanks = saved.flatMap(item => item.sets.map(getRank))
    return allRanks.sort(
      (a, b) =>
        lottoRanks.findIndex(r => r.label === a) - lottoRanks.findIndex(r => r.label === b)
    )[0]
  }

  const paginated = saved.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(saved.length / PAGE_SIZE)

  const overallRank = getOverallBestRank()
  const rankColor = getRankColor(overallRank)

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

  return (
    <main className="min-h-screen bg-background py-8 px-4 mb-16">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">저장한 번호</h2>
          <p className="text-sm text-gray-500">회차별 당첨 결과를 확인해보세요!</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 등수 설명 */}
            <div className="flex flex-row gap-2 text-xs">
              {lottoRanks
                .filter(rank => rank.label !== "꽝")
                .map(rank => (
                  <div key={rank.label} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full inline-block ${rank.color.split(" ")[0]}`} />
                    <span>{rank.label}</span>
                  </div>
                ))}
            </div>

            {/* 오른쪽: 등수/셀렉트 */}
            <div className="flex items-center flex-row gap-1">
              <div className="relative">
                {overallRank !== "등수없음" && (
                  <span className="absolute -top-3 left-0 -translate-x-1/2 z-50 text-yellow-400 color-yellow-400">
                    <Crown className="w-4 h-4" stroke="orange" fill="gold" />
                  </span>
                )}
                <div className={`w-16 px-2 py-1 text-xs text-center rounded-full border ${rankColor}`}>
                  {overallRank === "등수없음" ? "N/A" : overallRank}
                </div>
              </div>

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
          </div>

          {/* 당첨 번호 표시 */}
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
                const borderClass = getCardBorder(item)
                return (
                  <Card key={item.id} className={`p-4 border-2 ${borderClass}`}>
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleOpen(item.id)}
                    >
                      <p className="text-sm font-semibold">저장일: {item.date}</p>
                      {openId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    {openId === item.id && (
                      <div className="mt-3 space-y-4">
                        <div ref={receiptRef}>
                          <LottoReceiptView
                            timestamp={item.date}
                            lottoSets={item.sets}
                            getBorderColor={(row) => getRankColor(getRank(row))}
                          />
                        </div>
                        <LottoActionButtons
                          onDownload={downloadImage}
                          onShare={shareImage}
                          onDelete={() => handleDelete(item.id)}
                        />
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>

            {/* 페이지네이션 & 전체 삭제 */}
            <div className="relative pt-2 min-h-10">
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