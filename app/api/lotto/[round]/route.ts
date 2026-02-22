import { NextResponse } from "next/server"

export async function GET(request: Request, context: { params?: { round?: string } }) {
  const params = await context.params
  const round = params?.round

  if (!round) {
    return NextResponse.json({ error: "Round parameter is missing" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do?srchDir=center&srchLtEpsd=${round}&srchCursorLtEpsd=${round}`
    )
    const data = await response.json()

    if (!data.data?.list?.length) {
      return NextResponse.json({ error: "Invalid round or not yet drawn" }, { status: 404 })
    }

    const item = data.data.list[0]
    return NextResponse.json({
      round: item.ltEpsd,
      date: `${item.ltRflYmd.slice(0, 4)}-${item.ltRflYmd.slice(4, 6)}-${item.ltRflYmd.slice(6, 8)}`,
      numbers: [item.tm1WnNo, item.tm2WnNo, item.tm3WnNo, item.tm4WnNo, item.tm5WnNo, item.tm6WnNo],
      bonus: item.bnsWnNo,
    })
  } catch (error) {
    console.error("Lotto API error:", error)
    return NextResponse.json({ error: "Failed to fetch lotto data" }, { status: 500 })
  }
}