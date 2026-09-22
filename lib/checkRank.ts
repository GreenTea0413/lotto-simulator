export type Rank = "1등" | "2등" | "3등" | "4등" | "5등" | "꽝"

export const RANK_ORDER: Rank[] = ["1등", "2등", "3등", "4등", "5등", "꽝"]

export function getRank(set: number[], winning: { numbers: number[]; bonus: number }): Rank {
  const match = set.filter((n) => winning.numbers.includes(n)).length
  if (match === 6) return "1등"
  if (match === 5 && set.includes(winning.bonus)) return "2등"
  if (match === 5) return "3등"
  if (match === 4) return "4등"
  if (match === 3) return "5등"
  return "꽝"
}

// 여러 등수 중 가장 높은 등수
export const bestRank = (ranks: Rank[]): Rank =>
  ranks.reduce((a, b) => (RANK_ORDER.indexOf(a) <= RANK_ORDER.indexOf(b) ? a : b), "꽝")
