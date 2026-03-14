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

    // API는 srchLtEpsd와 무관하게 항상 최근 10회차 목록을 반환하므로
    // 한 번만 호출하고 list에서 최근 5회차를 처리
    const res = await fetch(
      `https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do?srchDir=center&srchLtEpsd=${currentRound}&srchCursorLtEpsd=${currentRound}`
    )
    const data = await res.json()

    // 최신 회차가 아직 없으면 이전 회차로 재시도
    const list = data.data?.list?.length
      ? data.data.list
      : await fetch(
          `https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do?srchDir=center&srchLtEpsd=${currentRound - 1}&srchCursorLtEpsd=${currentRound - 1}`
        ).then(r => r.json()).then(d => d.data?.list ?? [])

    const targetItems = list.slice(0, recentRounds)

    for (const item of targetItems) {
      const numbers = [
        item.tm1WnNo, item.tm2WnNo, item.tm3WnNo,
        item.tm4WnNo, item.tm5WnNo, item.tm6WnNo,
        item.bnsWnNo
      ]

      numbers.forEach((num: number) => {
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