"use client"

import { useEffect, useState } from "react"
import { LottoBall } from "./LottoBall"
import { Card } from "@/components/ui/card"
import { useLatestLotto } from "@/hooks/queries/useLatestLotto"
import { useLottoStore } from "@/hooks/stores/useLottoStore"


export function LatestResults() {
  const { latestResult } = useLottoStore()
  const {isLoading, isError } = useLatestLotto()

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center text-sm text-muted-foreground">최신 당첨번호 불러오는 중...</div>
      </Card>
    )
  }

  if (isError ||!latestResult) {
    return null
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold font-mono">최신 당첨번호</h2>
        <span className="text-xs text-muted-foreground font-mono">제 {latestResult.round}회</span>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 justify-center items-center">
          {latestResult.numbers.map((number, index) => (
            <LottoBall key={index} number={number} />
          ))}
          <span className="text-muted-foreground mx-1">+</span>
          <LottoBall number={latestResult.bonus} />
        </div>
        <div className="text-center text-xs text-muted-foreground">{latestResult.date}</div>
      </div>

      <div className="pt-2 border-t border-dashed border-border">
        <p className="text-[10px] text-center text-muted-foreground leading-relaxed">당신의 번호가 올라올 차례!</p>
      </div>
    </Card>
  )
}
