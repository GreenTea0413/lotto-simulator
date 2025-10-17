import { NextResponse } from "next/server"

export async function GET() {
  try {
    const startDate = new Date("2002-12-07")
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
    const currentRound = diffWeeks + 1

    const response = await fetch(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${currentRound}`)

    if (!response.ok) {
      throw new Error("Failed to fetch lottery data")
    }

    const data = await response.json()

    if (data.returnValue === "success") {
      return NextResponse.json({
        round: data.drwNo,
        date: data.drwNoDate,
        numbers: [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6],
        bonus: data.bnusNo,
      })
    }
    // 실패하면 이전 회차 데이터 가져오기
    const prevResponse = await fetch(
      `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${currentRound - 1}`,
    )
    const prevData = await prevResponse.json()

    return NextResponse.json({
      round: prevData.drwNo,
      date: prevData.drwNoDate,
      numbers: [
        prevData.drwtNo1,
        prevData.drwtNo2,
        prevData.drwtNo3,
        prevData.drwtNo4,
        prevData.drwtNo5,
        prevData.drwtNo6,
      ],
      bonus: prevData.bnusNo,
    })
  } catch (error) {
    console.error("Error fetching lottery data:", error)
    return NextResponse.json({ error: "Failed to fetch lottery data" }, { status: 500 })
  }
}
