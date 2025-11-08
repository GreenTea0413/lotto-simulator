"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Stat = {
  number: number
  freq: number
}

function getNumberColor(num: number) {
  if (num <= 10)
    return {
      backgroundColor: "#facc15",
      textColor: "#422006",
    }
  if (num <= 20)
    return {
      backgroundColor: "#3b82f6",
      textColor: "#f0f9ff",
    }
  if (num <= 30)
    return {
      backgroundColor: "#ef4444",
      textColor: "#fef2f2",
    }
  if (num <= 40)
    return {
      backgroundColor: "#52525b",
      textColor: "#f9fafb",
    }
  return {
    backgroundColor: "#16a34a",
    textColor: "#f0fdf4",
  }
}

export default function LottoFrequencyChart() {
  const [data, setData] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ max: 0, avg: 0, total: 0 })
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/lotto/recent-stats")
        const json = await res.json()

        const freqs = json.map((item: Stat) => item.freq)
        const maxFreq = Math.max(...freqs)
        const totalFreq = freqs.reduce((a: number, b: number) => a + b, 0)
        const avgFreq = (totalFreq / freqs.length).toFixed(2)

        setData(json)
        setStats({
          max: maxFreq,
          avg: Number.parseFloat(avgFreq),
          total: totalFreq,
        })
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">로또 통계를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  const topNumbers = [...data].sort((a, b) => b.freq - a.freq).slice(0, 3)
  const maxFreq = stats.max

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">로또 번호 분석</h2>
        <p className="text-sm text-muted-foreground">최근 5회차 당첨번호 출현 빈도 분석</p>
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex flex-col space-y-1">
          <h2 className="text-sm font-bold font-mono">출현 빈도 분포</h2>
          <span className="text-xs text-muted-foreground font-mono">TOP 3 빈도 분석</span>
        </div>
          
        <CardContent>
          <div className="space-y-3">
            {data.map((item, idx) => {
              const percentage = (item.freq / maxFreq) * 100
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
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
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
