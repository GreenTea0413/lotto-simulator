"use client"

import { useQuery } from "@tanstack/react-query"
import { LottoResult } from "../stores/useLottoStore"

export function useLottoByRound(round: number | null) {
  return useQuery<LottoResult[]>({
    queryKey: ["lotto", "last20", round],
    enabled: !!round,
    queryFn: async () => {
      if (!round) throw new Error("회차가 제공되지 않았습니다.")

      const results: LottoResult[] = []

      for (let i = 0; i < 20; i++) {
        const targetRound = round - i
        const res = await fetch(`/api/lotto/${targetRound}`)
        const data = await res.json()
        results.push(data)
      }

      return results.sort((a, b) => a.round - b.round)
    },
    staleTime: 1000 * 60 * 60 * 24, // 24시간
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7일
  })
}