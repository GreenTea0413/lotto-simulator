"use client"

import { useQuery } from "@tanstack/react-query"
import { LottoResult } from "../stores/useLottoStore"

export function useLatestLotto() {
  return useQuery<LottoResult>({
    queryKey: ["lotto", "latest"],
    queryFn: async () => {
      const res = await fetch("/api/lotto/latest")
      if (!res.ok) throw new Error("Failed to fetch latest lotto")
      return res.json()
    },
    staleTime: 1000 * 60 * 60 * 24, // 24시간 (로또는 일주일에 한 번만 추첨)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7일
  })
}