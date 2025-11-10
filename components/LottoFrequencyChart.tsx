"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null)

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
    <div className="w-full space-y-8">
      {/* 출현 빈도 분포 카드 */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col space-y-1">
          <h2 className="text-sm font-bold font-mono">출현 빈도 분포</h2>
          <span className="text-xs text-muted-foreground font-mono">숫자 1 ~ 45까지의 횟수</span>
        </div>

        <CardContent>
          <div className="space-y-3">
            {recentStats.map((item) => {
              const percentage = (item.freq / stats.max) * 100
              const color = getNumberColor(item.number)

              return (
                <div
                  key={item.number}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredNumber(item.number)}
                  onMouseLeave={() => setHoveredNumber(null)}
                >
                  <div className="flex items-center gap-4 mb-1.5">
                    <div className="text-center font-bold text-sm min-w-10" style={{ color: color.backgroundColor }}>
                      {item.number}
                    </div>
                    <div className="flex-1">
                      <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
                        <div
                          className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color.backgroundColor,
                            boxShadow: `0 0 20px ${color.backgroundColor}40`,
                          }}
                        >
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right min-w-12 text-sm font-semibold text-foreground">{item.freq}회</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top 3 카드 */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col space-y-1">
          <h2 className="text-sm font-bold font-mono">가장 많이 나온 번호</h2>
          <span className="text-xs text-muted-foreground font-mono">TOP 3 빈도 분석</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {topNumbers.map((num, idx) => {
            const color = getNumberColor(num.number)
            const rankEmoji = ["🥇", "🥈", "🥉"][idx]
            return (
              <div
                key={num.number}
                className="backdrop-blur-xl from-white/10 to-white/5 border border-white/20 rounded-2xl text-center hover:from-white/15 hover:to-white/10 transition-all duration-300"
              >
                <div className="text-2xl mb-3">{rankEmoji}</div>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-lg"
                  style={{
                    backgroundColor: color.backgroundColor,
                    color: color.textColor,
                    boxShadow: `0 8px 20px ${color.backgroundColor}40`,
                  }}
                >
                  {num.number}
                </div>
                <p className="text-xs text-muted-foreground mb-1">출현 횟수</p>
                <p className="text-2xl font-bold text-foreground">{num.freq}회</p>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}