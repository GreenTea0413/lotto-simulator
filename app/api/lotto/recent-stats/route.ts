// app/api/lotto/recent-stats/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const startDate = new Date("2002-12-07")
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
    const currentRound = diffWeeks + 1

    const recentRounds = 5
    const frequencyMap = new Map<number, number>()

    for (let i = 0; i < recentRounds; i++) {
      const round = currentRound - i
      const res = await fetch(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`)
      const data = await res.json()

      if (data.returnValue !== "success") continue

      const numbers = [
        data.drwtNo1, data.drwtNo2, data.drwtNo3,
        data.drwtNo4, data.drwtNo5, data.drwtNo6,
        data.bnusNo
      ]

      numbers.forEach(num => {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1)
      })
    }

    const result = Array.from({ length: 45 }, (_, i) => ({
      number: i + 1,
      freq: frequencyMap.get(i + 1) || 0
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in recent-stats:", error)
    return NextResponse.json({ error: "Failed to fetch recent stats" }, { status: 500 })
  }
}