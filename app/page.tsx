"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LottoReceipt } from "@/components/lotto-receipt"
import { LatestResults } from "@/components/latest-results"
import KakaoMap from "@/components/kakao-map"
import NearbySpots from "@/components/nearby-spots"
import { luckySpots } from "@/data/luckySpots"
import { getDistance } from "@/lib/getDistance"
import { useKakaoLoader } from "@/hooks/useKakaoLoader"
import { MapPin } from "lucide-react"

export default function Home() {
  const [lottoSets, setLottoSets] = useState<number[][]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyPlaces, setNearbyPlaces] = useState(luckySpots)
  const loaded = useKakaoLoader()

  const generateLottoNumbers = () => {
    setIsGenerating(true)

    // 애니메이션 효과를 위한 딜레이
    setTimeout(() => {
      const newSets: number[][] = []

      for (let i = 0; i < 5; i++) {
        const numbers = new Set<number>()
        while (numbers.size < 6) {
          numbers.add(Math.floor(Math.random() * 45) + 1)
        }
        newSets.push(Array.from(numbers).sort((a, b) => a - b))
      }

      setLottoSets(newSets)
      setIsGenerating(false)
    }, 500)
  }

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })

        const filtered = luckySpots.filter((spot) => {
          const dist = getDistance(latitude, longitude, spot.lat, spot.lng)
          return dist <= 20 // 20km 이내
        })

        setNearbyPlaces(filtered.length > 0 ? filtered : luckySpots)
      },
      () => {
        alert("위치 권한을 허용해주세요.")
      },
    )
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground font-mono">로또 6/45</h1>
          <p className="text-sm text-muted-foreground">1등만이 답이다</p>
        </div>

        <Button
          onClick={generateLottoNumbers}
          disabled={isGenerating}
          className="w-full h-12 text-base font-mono"
          size="lg"
        >
          {isGenerating ? "생성 중..." : "번호 생성하기"}
        </Button>

        {lottoSets.length > 0 && <LottoReceipt lottoSets={lottoSets} />}

        <LatestResults />

        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "2px dashed #d1d5db" }}>
          <Button
            onClick={handleFindNearby}
            className="w-full h-12 text-base font-mono"
            size="lg"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <MapPin size={20} />
            주변 명당 찾기
          </Button>

          {loaded && userLocation ? (
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <KakaoMap userLocation={userLocation} places={nearbyPlaces} />
              <NearbySpots userLocation={userLocation} />
            </div>
          ) : loaded && !userLocation ? (
            <p
              style={{
                textAlign: "center",
                marginTop: "16px",
                color: "#6b7280",
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
              }}
            >
              위 버튼을 눌러 주변 명당을 찾아보세요
            </p>
          ) : (
            <p
              style={{
                textAlign: "center",
                marginTop: "16px",
                color: "#6b7280",
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
              }}
            >
              지도를 불러오는 중입니다...
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
