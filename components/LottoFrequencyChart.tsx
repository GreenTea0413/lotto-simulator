"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { useRecentStats } from "@/hooks/queries/useRecentStats"
import { useLottoStore } from "@/hooks/stores/useLottoStore"

function getNumberColor(num: number) {
  if (num <= 10) return { backgroundColor: "#facc15", textColor: "#422006" }
  if (num <= 20) return { backgroundColor: "#3b82f6", textColor: "#f0f9ff" }
  if (num <= 30) return { backgroundColor: "#ef4444", textColor: "#fef2f2" }
  if (num <= 40) return { backgroundColor: "#52525b", textColor: "#f9fafb" }
  return { backgroundColor: "#16a34a", textColor: "#f0fdf4" }
}

export default function LottoFrequencyChart() {
  const { recentStats } = useLottoStore()
  const { isLoading, isError } = useRecentStats()

  const stats = useMemo(() => {
    if (!recentStats) return { max: 0, avg: 0, total: 0 }
    const freqs = recentStats.map((item) => item.freq)
    const max = Math.max(...freqs)
    const total = freqs.reduce((a, b) => a + b, 0)
    const avg = parseFloat((total / freqs.length).toFixed(2))
    return { max, avg, total }
  }, [recentStats])

  const topNumbers = useMemo(() => {
    if (!recentStats) return []
    return [...recentStats].sort((a, b) => b.freq - a.freq).slice(0, 3)
  }, [recentStats])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">로또 통계를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (isError || !recentStats) {
    return <p className="text-center text-sm text-red-500">데이터를 불러오지 못했습니다.</p>
  }

  return (
    <div className="w-full space-y-6">
      {/* Top 3 카드 */}
      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-bold font-mono">가장 많이 나온 번호</h2>
        <div className="grid grid-cols-3 gap-3">
          {topNumbers.map((num, idx) => {
            const color = getNumberColor(num.number)
            const rankEmoji = ["🥇", "🥈", "🥉"][idx]
            return (
              <div key={num.number} className="py-3 border border-border rounded-2xl text-center">
                <div className="text-2xl mb-2">{rankEmoji}</div>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-2 shadow-lg"
                  style={{
                    backgroundColor: color.backgroundColor,
                    color: color.textColor,
                    boxShadow: `0 8px 20px ${color.backgroundColor}40`,
                  }}
                >
                  {num.number}
                </div>
                <p className="text-xs text-muted-foreground">출현 횟수</p>
                <p className="text-xl font-bold text-foreground">{num.freq}회</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* 출현 빈도 분포: 1~45 격자, 많이 나올수록 진하게 */}
      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-bold font-mono">출현 빈도 분포</h2>
        <div className="grid grid-cols-9 gap-1.5">
          {recentStats.map((item) => {
            const color = getNumberColor(item.number)
            const ratio = stats.max ? item.freq / stats.max : 0
            return (
              <div
                key={item.number}
                className="aspect-square rounded-lg flex flex-col items-center justify-center border border-border"
                style={{ backgroundColor: item.freq ? `${color.backgroundColor}${Math.round((0.2 + ratio * 0.8) * 255).toString(16).padStart(2, "0")}` : undefined }}
              >
                <span className="text-sm font-bold leading-none" style={{ color: ratio > 0.5 ? color.textColor : undefined }}>
                  {item.number}
                </span>
                <span className="text-[10px] leading-none mt-0.5" style={{ color: ratio > 0.5 ? color.textColor : "var(--muted-foreground)" }}>
                  {item.freq}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
