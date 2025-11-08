import { NextResponse } from "next/server"

export async function GET(_: Request, context: { params: { round: string } }) {
  const { round } = context.params

  try {
    const response = await fetch(
      `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`
    )
    const data = await response.json()

    if (data.returnValue !== "success") {
      return NextResponse.json({ error: "Invalid round or not yet drawn" }, { status: 404 })
    }

    return NextResponse.json({
      round: data.drwNo,
      date: data.drwNoDate,
      numbers: [
        data.drwtNo1,
        data.drwtNo2,
        data.drwtNo3,
        data.drwtNo4,
        data.drwtNo5,
        data.drwtNo6,
      ],
      bonus: data.bnusNo,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lotto data" }, { status: 500 })
  }
}