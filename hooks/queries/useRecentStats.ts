"use client"

import { useQuery } from "@tanstack/react-query"
import { useLottoStore } from "../stores/useLottoStore"
import { Stat } from "../stores/useLottoStore"

export function useRecentStats() {
  const recentStats = useLottoStore((state) => state.recentStats)
  const setRecentStats = useLottoStore((state) => state.setRecentStats)

  const query = useQuery<Stat[]>({
    queryKey: ["lotto", "recent-stats"],
    queryFn: async () => {
      const res = await fetch("/api/lotto/recent-stats")
      if (!res.ok) throw new Error("Failed to fetch recent stats")

      const data: Stat[] = await res.json()
      setRecentStats(data as Stat[])
      return data
    },
    enabled: recentStats.length === 0,
    refetchInterval: 1000 * 60 * 30, 
    staleTime: 1000 * 60 * 29,
  })  

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}