"use client"

import { useQuery } from "@tanstack/react-query"
import { LottoResult, useLottoStore } from "../stores/useLottoStore"

export function useLatestLotto() {
  const latestResult = useLottoStore((state) => state.latestResult)
  const setLatestResult = useLottoStore((state) => state.setLatestResult)

  const query = useQuery<LottoResult>({
    queryKey: ["lotto", "latest"],
    queryFn: async () => {
      const res = await fetch("/api/lotto/latest")
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
    
      setLatestResult(data)
      return data
    },
    enabled: !latestResult,
    refetchInterval: 1000 * 60 * 30, 
    staleTime: 1000 * 60 * 29,
  })

  return {
    data: latestResult || query.data, 
    isLoading: !latestResult && query.isLoading,
    isError: query.isError,
  }
}