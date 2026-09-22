"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { LottoResult, useLottoStore } from "../stores/useLottoStore"

// initial: 서버에서 미리 받아온 값 (있으면 요청 생략)
export function useLatestLotto(initial?: LottoResult | null) {
  const stored = useLottoStore((state) => state.latestResult)
  const setLatestResult = useLottoStore((state) => state.setLatestResult)
  const latestResult = stored ?? initial ?? null

  // 다른 페이지에서도 다시 요청하지 않도록 스토어에 채워둠
  useEffect(() => {
    if (!stored && initial) setLatestResult(initial)
  }, [stored, initial, setLatestResult])

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
