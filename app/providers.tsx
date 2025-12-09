"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60 * 24, // 24시간 (로또는 일주일에 한 번만 추첨)
            gcTime: 1000 * 60 * 60 * 24 * 7, // 7일
            refetchOnWindowFocus: false,
            retry: 1, // 실패 시 1번만 재시도
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}