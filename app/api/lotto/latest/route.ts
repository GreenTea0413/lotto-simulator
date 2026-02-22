import { NextResponse } from "next/server"

export async function GET() {
  try {
    const startDate = new Date("2002-12-07")
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
    const currentRound = diffWeeks + 1

    const response = await fetch(
      `https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do?srchDir=center&srchLtEpsd=${currentRound}&srchCursorLtEpsd=${currentRound}`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch lottery data")
    }

    const data = await response.json()

    if (data.data?.list?.length) {
      const item = data.data.list[0]
      return NextResponse.json({
        round: item.ltEpsd,
        date: `${item.ltRflYmd.slice(0, 4)}-${item.ltRflYmd.slice(4, 6)}-${item.ltRflYmd.slice(6, 8)}`,
        numbers: [item.tm1WnNo, item.tm2WnNo, item.tm3WnNo, item.tm4WnNo, item.tm5WnNo, item.tm6WnNo],
        bonus: item.bnsWnNo,
      })
    }
    // 실패하면 이전 회차 데이터 가져오기
    const prevResponse = await fetch(
      `https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do?srchDir=center&srchLtEpsd=${currentRound - 1}&srchCursorLtEpsd=${currentRound - 1}`
    )
    const prevData = await prevResponse.json()
    const prevItem = prevData.data.list[0]

    return NextResponse.json({
      round: prevItem.ltEpsd,
      date: `${prevItem.ltRflYmd.slice(0, 4)}-${prevItem.ltRflYmd.slice(4, 6)}-${prevItem.ltRflYmd.slice(6, 8)}`,
      numbers: [prevItem.tm1WnNo, prevItem.tm2WnNo, prevItem.tm3WnNo, prevItem.tm4WnNo, prevItem.tm5WnNo, prevItem.tm6WnNo],
      bonus: prevItem.bnsWnNo,
    })
  } catch (error) {
    console.error("Error fetching lottery data:", error)
    return NextResponse.json({ error: "Failed to fetch lottery data" }, { status: 500 })
  }
}
