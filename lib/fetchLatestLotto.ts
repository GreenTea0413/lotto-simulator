import type { LottoResult } from "@/hooks/stores/useLottoStore"

const REVALIDATE = 600 // 10분

async function fetchRound(round: number) {
  const res = await fetch(
    `https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do?srchDir=center&srchLtEpsd=${round}&srchCursorLtEpsd=${round}`,
    { next: { revalidate: REVALIDATE } }
  )
  if (!res.ok) throw new Error("Failed to fetch lottery data")
  const data = await res.json()
  return data.data?.list?.[0]
}

// 최신 회차를 가져오고, 아직 추첨 전이면 이전 회차를 반환
export async function fetchLatestLotto(): Promise<LottoResult> {
  const diffWeeks = Math.floor((Date.now() - new Date("2002-12-07").getTime()) / (1000 * 60 * 60 * 24 * 7))
  const currentRound = diffWeeks + 1

  const item = (await fetchRound(currentRound)) ?? (await fetchRound(currentRound - 1))
  if (!item) throw new Error("No lottery data")

  return {
    round: item.ltEpsd,
    date: `${item.ltRflYmd.slice(0, 4)}-${item.ltRflYmd.slice(4, 6)}-${item.ltRflYmd.slice(6, 8)}`,
    numbers: [item.tm1WnNo, item.tm2WnNo, item.tm3WnNo, item.tm4WnNo, item.tm5WnNo, item.tm6WnNo],
    bonus: item.bnsWnNo,
  }
}
