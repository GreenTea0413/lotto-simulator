"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Crown, Trash2 } from "lucide-react"
import { LottoReceiptView } from "@/components/LottoReceiptView"
import { LottoActionButtons } from "@/components/LottoActionButtons"
import { LottoBall } from "@/components/LottoBall"
import KakaoAd320x50 from "@/components/KakaoAd320x50"
import KakaoAd320x100 from "@/components/KakaoAd320x100"
import { Card } from "@/components/ui/card"

import { useLottoStore, LottoResult } from "@/hooks/stores/useLottoStore"
import { useLatestLotto } from "@/hooks/queries/useLatestLotto"
import { useLottoByRound } from "@/hooks/queries/useLottoByRound"
import { useLottoCapture } from "@/hooks/ui/useLottoCapture"

interface SavedLotto {
  id: number
  date: string
  sets: number[][]
}

const PAGE_SIZE = 10

const lottoRanks = [
  { label: "1등", color: "bg-yellow-400 border-yellow-400 text-yellow-500 shadow-yellow-400" },
  { label: "2등", color: "bg-[#C7C7C7] border-[#C7C7C7] text-white shadow-[#C7C7C7]" },
  { label: "3등", color: "bg-[#D2732C] border-[#D2732C] text-white shadow-[#D2732C]" },
  { label: "4등", color: "bg-green-400 border-green-400" },
  { label: "5등", color: "bg-blue-400 border-blue-400" },
  { label: "꽝", color: "bg-gray-200 border-gray-100" }
]

export default function LottoSavingPage() {
  // ✅ 저장된 번호
  const [saved, setSaved] = useState<SavedLotto[]>([])
  const [openId, setOpenId] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  // ✅ Zustand에서 마지막 50회차 당첨결과 사용
  const last50Rounds = useLottoStore((state) => state.last50Rounds)

  // ✅ 최신 회차 가져오는 Query
  const { data: latest } = useLatestLotto()

  // ✅ 받은 latest.round로 50개 로딩
  const { isLoading } = useLottoByRound(latest?.round ?? null)

  // ✅ 회차 선택값 및 옵션
  const [selectedRound, setSelectedRound] = useState<number | null>(null)
  const [roundOptions, setRoundOptions] = useState<number[]>([])

  // ✅ 해당 회차 당첨 결과
  const winning = last50Rounds.find(r => r.round === selectedRound) ?? null

  // ✅ 캡쳐용 Ref
  const receiptRef = useRef<HTMLDivElement>(null)
  const { downloadImage, shareImage } = useLottoCapture(receiptRef)

  // ✅ 로컬 저장 번호 불러오기
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedLotto") || "[]")
    setSaved(data)
  }, [])

  // ✅ 최신 회차 기반 옵션 생성 (50개)
  useEffect(() => {
    if (!latest) return
    const latestRound = latest.round

    setRoundOptions(Array.from({ length: 50 }, (_, i) => latestRound - 49 + i))
    setSelectedRound(latestRound)
  }, [latest])

  // ✅ 순위 판단
  const getRank = (set: number[]) => {
    if (!winning) return "꽝"
    const match = set.filter((n) => winning.numbers.includes(n)).length
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
      (a, b) => lottoRanks.findIndex(r => r.label === a) - lottoRanks.findIndex(r => r.label === b)
    )[0]
    return getRankColor(bestRank)
  }

  const getOverallBestRank = () => {
    if (!saved.length || !winning) return "등수없음"
    const allRanks = saved.flatMap((item) => item.sets.map(getRank))
    return allRanks.sort(
      (a, b) => lottoRanks.findIndex(r => r.label === a) - lottoRanks.findIndex(r => r.label === b)
    )[0]
  }

  const paginated = saved.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(saved.length / PAGE_SIZE)

  const toggleOpen = (id: number) =>
    setOpenId((prev) => (prev === id ? null : id))

  const handleDelete = (id: number) => {
    const filtered = saved.filter((s) => s.id !== id)
    setSaved(filtered)
    localStorage.setItem("savedLotto", JSON.stringify(filtered))
  }

  const handleDeleteAll = () => {
    if (!confirm("저장된 모든 번호를 삭제하시겠습니까?")) return
    setSaved([])
    localStorage.removeItem("savedLotto")
    setOpenId(null)
    setPage(1)
  }

  // ✅ 50개 로딩 전이거나 최신 정보가 없으면 로딩
  if (isLoading || !latest || last50Rounds.length < 50) {
    return (
      <div className="flex justify-center items-center h-[500px] text-gray-500">
        로딩 중...
      </div>
    )
  }

  const overallRank = getOverallBestRank()
  const rankColor = getRankColor(overallRank)

  return (
    <main className="min-h-screen bg-background py-8 px-4 mb-16">
      <div className="max-w-md mx-auto space-y-6">

        <KakaoAd320x50 />

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">저장한 번호</h2>
          <p className="text-sm text-gray-500">회차별 당첨 결과를 확인해보세요!</p>
        </div>

        {/* ✅ 회차 선택 */}
        <div className="flex justify-between items-center">
          <div className="flex flex-row gap-2 text-xs">
            {lottoRanks
              .filter(r => r.label !== "꽝")
              .map((rank) => (
                <div key={rank.label} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${rank.color.split(" ")[0]}`} />
                  <span>{rank.label}</span>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              {overallRank !== "등수없음" && (
                <span className="absolute -top-3 left-0 -translate-x-1/2 text-yellow-400">
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
              {roundOptions.map((n) => (
                <option key={n} value={n}>
                  {n}회차
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ 당첨 번호 */}
        {winning && (
          <Card className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold font-mono">당첨번호</h2>
              <span className="text-xs text-muted-foreground font-mono">
                제 {winning.round}회
              </span>
            </div>

            <div className="flex gap-2 justify-center items-center">
              {winning.numbers.map((n, idx) => (
                <LottoBall key={idx} number={n} />
              ))}
              <span className="mx-1 text-muted-foreground">+</span>
              <LottoBall number={winning.bonus} />
            </div>
          </Card>
        )}

        {/* ✅ 저장 번호 */}
        {saved.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">저장된 번호가 없습니다.</p>
        ) : (
          <div className="space-y-4 min-h-[740px] flex flex-col justify-between">
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

            {/* ✅ 페이지네이션 */}
            <div className="relative pt-2 min-h-10">
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="disabled:opacity-30"
                >
                  <ChevronLeft />
                </button>

                <span className="text-sm text-muted-foreground">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

        <KakaoAd320x100 />
      </div>
    </main>
  )
}