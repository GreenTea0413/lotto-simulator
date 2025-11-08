"use client"

import { useEffect, useState } from "react"

export default function LottoSavingPage() {
  const [saved, setSaved] = useState<any[]>([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedLotto") || "[]")
    setSaved(data)
  }, [])

  return (
     <main className="min-h-screen bg-background py-8 px-4 mb-16">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">저장한 번호</h1>

        {saved.length === 0 && <p className="text-gray-500">저장된 번호가 없습니다.</p>}

        <div className="space-y-4">
          {saved.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <p className="text-xs text-gray-500 mb-2">
                {item.date} {item.time}
              </p>

              {item.numbers.map((set: number[], idx: number) => (
                <div key={idx} className="flex gap-2 mb-2">
                  {set.map((num: number) => (
                    <div
                      key={num}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}