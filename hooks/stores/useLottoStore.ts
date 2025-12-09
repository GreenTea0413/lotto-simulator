// 타입 정의만 export (React Query로 상태 관리)
export interface LottoResult {
  round: number
  date: string
  numbers: number[]
  bonus: number
}

export interface Stat {
  number: number
  freq: number
}