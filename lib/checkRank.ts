export function checkRank(
  mySet: number[],
  winningNumbers: number[],
  bonus: number
): number | null {
  const matchedCount = mySet.filter((n) => winningNumbers.includes(n)).length
  const hasBonus = !mySet.includes(bonus) && mySet.filter((n) => winningNumbers.includes(n)).length === 5

  if (matchedCount === 6) return 1
  if (matchedCount === 5 && mySet.includes(bonus)) return 2
  if (matchedCount === 5) return 3
  return null
}