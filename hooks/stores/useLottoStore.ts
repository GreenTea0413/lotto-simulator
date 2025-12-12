import { create } from 'zustand'

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

interface LottoStore {
  latestResult: LottoResult | null
  recentStats: Stat[]              
  last50Rounds: LottoResult[]      
  
  setLatestResult: (result: LottoResult) => void
  setRecentStats: (stats: Stat[]) => void
  setLast50Rounds: (results: LottoResult[]) => void
}

export const useLottoStore = create<LottoStore>((set) => ({
  latestResult: null,
  recentStats: [],          
  last50Rounds: [],

  setLatestResult: (result) => set({ latestResult: result }),
  setRecentStats: (stats) => set({ recentStats: stats }),
  setLast50Rounds: (results) => set({ last50Rounds: results }),
}))