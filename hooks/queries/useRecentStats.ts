"use client"

import { useQuery } from "@tanstack/react-query"
import { Stat } from "../stores/useLottoStore"

export function useRecentStats() {
  return useQuery<Stat[]>({
    queryKey: ["lotto", "recent-stats"],
    queryFn: async () => {
      const res = await fetch("/api/lotto/recent-stats")
      if (!res.ok) throw new Error("Failed to fetch recent stats")
      return res.json()
    },
    staleTime: 1000 * 60 * 60 * 24, // 24시간
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7일
  })
}