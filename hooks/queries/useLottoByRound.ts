"use client"

import { useQuery } from "@tanstack/react-query"
import { LottoResult, useLottoStore } from "../stores/useLottoStore"

export function useLottoByRound(round: number | null) {
  const last50Rounds = useLottoStore((state) => state.last50Rounds)
  const setLast50Rounds = useLottoStore((state) => state.setLast50Rounds)

  const alreadyLoaded = last50Rounds.length >= 20

  const query = useQuery<LottoResult[]>({
    queryKey: ["lotto", "last50"],
    enabled: !alreadyLoaded && !!round,
    queryFn: async () => {
      if (!round) throw new Error("회차가 제공되지 않았습니다.")

      const results = await Promise.all(
        Array.from({ length: 20 }, (_, i) =>
          fetch(`/api/lotto/${round - i}`).then((r) => r.json())
        )
      )

      const sorted = results.sort((a, b) => a.round - b.round)

      setLast50Rounds(sorted)
      return sorted
    },
    staleTime: 1000 * 60 * 30,
  })

  return {
    isLoading: !alreadyLoaded && query.isLoading,
    isError: query.isError,
  }
}