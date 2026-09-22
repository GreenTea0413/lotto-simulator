"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Trash2, Loader2 } from "lucide-react"
import { LottoReceiptView } from "@/components/LottoReceiptView"
import { LottoActionButtons } from "@/components/LottoActionButtons"
import { LottoBall } from "@/components/LottoBall"
// import KakaoAd320x50 from "@/components/KakaoAd320x50"
// import KakaoAd320x100 from "@/components/KakaoAd320x100"
import { Card } from "@/components/ui/card"

import { useLottoStore } from "@/hooks/stores/useLottoStore"
import { getRank, bestRank, RANK_ORDER, type Rank } from "@/lib/checkRank"
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

type SortOrder = "newest" | "oldest" | "rank"

export default function LottoSavingPage() {
  const [saved, setSaved] = useState<SavedLotto[]>([])
  const [openId, setOpenId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")

  const last50Rounds = useLottoStore((state) => state.last50Rounds)
  const { data: latest, isLoading: isLatestLoading } = useLatestLotto()

  const [selectedRound, setSelectedRound] = useState<number | null>(null)
  const [roundOptions, setRoundOptions] = useState<number[]>([])
  
  // 선택된 회차의 데이터를 가져오기 (zustand에 자동 저장됨)
  const { isLoading: isRoundLoading } = useLottoByRound(selectedRound)
  
  // winning 데이터: zustand에서 찾고, 없으면 최신 회차 데이터 사용
  const winning = last50Rounds.find(r => r.round === selectedRound) 
    ?? (selectedRound === latest?.round ? latest : null)

  const receiptRef = useRef<HTMLDivElement>(null)
  const { downloadImage, shareImage } = useLottoCapture(receiptRef)

  // 로컬스토리지에서 저장된 번호 로드
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedLotto") || "[]")
    setSaved(data)
  }, [])

  // 최신 회차 기준으로 회차 옵션 설정
  useEffect(() => {
    if (!latest) return
    const latestRound = latest.round

    setRoundOptions(Array.from({ length: 20 }, (_, i) => latestRound - 19 + i))
    setSelectedRound(latestRound)
  }, [latest])

  const rankOf = (set: number[]): Rank => (winning ? getRank(set, winning) : "꽝")
  const itemRank = (item: SavedLotto) => bestRank(item.sets.map(rankOf))

  // 최근 20회 전체에서 저장 번호의 최고 등수 (동률이면 최신 회차)
  const bestInRecent = last50Rounds
    .filter((w) => w.numbers)
    .reduce<{ round: number; rank: Rank } | null>((best, w) => {
      const rank = bestRank(saved.flatMap((item) => item.sets).map((set) => getRank(set, w)))
      if (rank === "꽝") return best
      const diff = best ? RANK_ORDER.indexOf(rank) - RANK_ORDER.indexOf(best.rank) : -1
      return diff < 0 || (diff === 0 && w.round > best!.round) ? { round: w.round, rank } : best
    }, null)

  const getRankColor = (rank: string) =>
    lottoRanks.find(r => r.label === rank)?.color.split(" ")[1] || "border-gray-200"

  const getRankBg = (rank: string) =>
    lottoRanks.find(r => r.label === rank)?.color.split(" ")[0] || "bg-gray-200"

  const sortedSaved = [...saved].sort((a, b) => {
    if (sortOrder === "newest") return b.id - a.id
    if (sortOrder === "oldest") return a.id - b.id
    return RANK_ORDER.indexOf(itemRank(a)) - RANK_ORDER.indexOf(itemRank(b))
  })

  const paginated = sortedSaved.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
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

  // 데이터 로딩 상태 표시
  const isDataLoading = isRoundLoading && !winning

  return (
    <div className="py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">

        {/* <KakaoAd320x50 /> */}

        <h2 className="sr-only">내 번호</h2>

        {/* ✅ 등수별 색상 */}
        <div className="flex justify-center gap-3 text-xs">
          {lottoRanks
            .filter((r) => r.label !== "꽝")
            .map((rank) => (
              <div key={rank.label} className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${getRankBg(rank.label)}`} />
                <span>{rank.label}</span>
              </div>
            ))}
        </div>

        {/* ✅ 최근 20회 최고 등수 */}
        {saved.length > 0 && last50Rounds.length > 0 && (
          <button
            onClick={() => bestInRecent && setSelectedRound(bestInRecent.round)}
            disabled={!bestInRecent}
            className={`w-full flex justify-between items-center px-4 py-3 rounded-lg border-2 text-sm ${bestInRecent ? getRankColor(bestInRecent.rank) : "border-gray-200"}`}
          >
            <span className="text-muted-foreground">최근 20회 최고 등수</span>
            {bestInRecent ? (
              <span className="flex items-center gap-1 font-bold">
                {bestInRecent.round}회 · {bestInRecent.rank}
                <ChevronRight size={16} />
              </span>
            ) : (
              <span className="text-muted-foreground">당첨 없음</span>
            )}
          </button>
        )}

        {/* ✅ 회차 선택 + 당첨 번호 */}
        <Card className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold font-mono">당첨번호</h2>
            <div className="relative flex items-center">
              {(isLatestLoading || isRoundLoading) && (
                <Loader2 className="absolute right-2 w-3 h-3 animate-spin text-muted-foreground pointer-events-none" />
              )}
              <select
                className={`border px-2 py-1 rounded text-sm disabled:opacity-60 ${(isLatestLoading || isRoundLoading) ? "appearance-none pr-6" : ""}`}
                value={selectedRound ?? ""}
                onChange={(e) => setSelectedRound(parseInt(e.target.value))}
                disabled={isLatestLoading}
              >
                {roundOptions.length > 0 ? (
                  roundOptions.map((n) => (
                    <option key={n} value={n}>{n}회차</option>
                  ))
                ) : (
                  <option value="">-- 회차 --</option>
                )}
              </select>
            </div>
          </div>

          {winning ? (
            <div className="flex gap-2 justify-center items-center">
              {winning.numbers.map((n: number, idx: number) => (
                <LottoBall key={idx} number={n} />
              ))}
              <span className="mx-1 text-muted-foreground">+</span>
              <LottoBall number={winning.bonus} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-9 text-sm text-muted-foreground">
              {isDataLoading || isLatestLoading ? "당첨 번호를 불러오는 중..." : "당첨 번호가 없습니다."}
            </div>
          )}
        </Card>

        {/* ✅ 정렬 옵션 */}
        {saved.length > 0 && (
          <div className="flex gap-2 justify-end">
            {(["newest", "oldest", "rank"] as SortOrder[]).map((order) => (
              <button
                key={order}
                onClick={() => { setSortOrder(order); setPage(1) }}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  sortOrder === order
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground border-gray-300 hover:border-gray-400"
                }`}
              >
                {order === "newest" ? "최신순" : order === "oldest" ? "과거순" : "등수순"}
              </button>
            ))}
          </div>
        )}

        {/* ✅ 저장 번호 */}
        {saved.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-gray-500">저장된 번호가 없습니다.</p>
            <p className="text-xs text-gray-400">로또 번호를 생성하고 저장해보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-4">
              {paginated.map((item) => {
                const rank = itemRank(item)

                return (
                  <Card key={item.id} className={`p-4 border-2 ${getRankColor(rank)} transition-all`}>
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleOpen(item.id)}
                    >
                      <p className="text-sm font-semibold">저장일: {item.date}</p>
                      <div className="flex items-center gap-2">
                        {winning && (rank === "꽝" ? (
                          <span className="text-xs text-muted-foreground">낙첨</span>
                        ) : (
                          <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${getRankBg(rank)}`}>{rank}</span>
                        ))}
                        {openId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {openId === item.id && (
                      <div className="mt-3 space-y-4">
                        <div ref={receiptRef}>
                          <LottoReceiptView
                            timestamp={item.date}
                            lottoSets={item.sets}
                            getBorderColor={(row) => getRankColor(rankOf(row))}
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
                  className="disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft />
                </button>

                <span className="text-sm text-muted-foreground">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="disabled:opacity-30 disabled:cursor-not-allowed"
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

        {/* <KakaoAd320x100 /> */}
      </div>
    </div>
  )
}