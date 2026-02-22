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
      const res = await fetch(
        `https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do?srchDir=center&srchLtEpsd=${round}&srchCursorLtEpsd=${round}`
      )
      const data = await res.json()

      if (!data.data?.list?.length) continue

      const item = data.data.list[0]
      const numbers = [
        item.tm1WnNo, item.tm2WnNo, item.tm3WnNo,
        item.tm4WnNo, item.tm5WnNo, item.tm6WnNo,
        item.bnsWnNo
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