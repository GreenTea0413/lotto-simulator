"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import KakaoMap from "@/components/KakaoMap"
import NearbySpots from "@/components/NearbySpots"
import { luckySpots } from "@/data/luckySpots"
import { getDistance } from "@/lib/getDistance"
import { loadKakaoMapScript } from "@/lib/loadKakaoMapScript"
import { MapPin } from "lucide-react"
import KakaoAd from "@/components/KakaoAd320x50"
import KakaoAd2 from "@/components/KakaoAd320x100"

export default function LuckyMapSection() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({
    lat: 37.5665,
    lng: 126.9780,
  })
  const [visibleSpots, setVisibleSpots] = useState<typeof luckySpots>([])
  const [sdkLoaded, setSdkLoaded] = useState(false)

  useEffect(() => {
    loadKakaoMapScript(() => setSdkLoaded(true))
  }, [])

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      alert("위치 정보를 지원하지 않습니다.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const filtered = luckySpots.filter((spot) => {
          const dist = getDistance(latitude, longitude, spot.lat, spot.lng)
          return dist <= 20
        })

        setUserLocation({ lat: latitude, lng: longitude })
        setVisibleSpots(filtered.length > 0 ? filtered : luckySpots)
      },
      () => {
        alert("위치 권한을 허용해주세요.")
      }
    )
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4 mb-16">
      <div className="max-w-md mx-auto space-y-6">
        <KakaoAd
          unitId="DAN-QdWAILcwQ2JIWqZn"
          width="320"
          height="50"
          onFailCallback="handleAdFail1"
        />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">행운 명당 지도</h2>
          <p className="text-sm text-muted-foreground">최근 1등 당첨 판매점 위치를 알려드릴게요!</p>
          <p className="text-sm text-muted-foreground">* 출처: 네이버 * 카카오맵 설치 필요</p>
        </div>

        {sdkLoaded ? (
          <>
            <KakaoMap userLocation={userLocation} places={visibleSpots} />
            {visibleSpots.length > 0 && userLocation && (
              <NearbySpots userLocation={userLocation} />
            )}
          </>
        ) : (
          <p className="text-center text-sm text-gray-500">지도를 불러오는 중입니다...</p>
        )}

        <Button
          onClick={handleFindNearby}
          className="w-full h-12 text-base font-mono"
          size="lg"
        >
          <MapPin size={20} className="mr-2" />
          주변 명당 찾기
        </Button>
        <KakaoAd2/>
      </div>
    </main>
  )
}