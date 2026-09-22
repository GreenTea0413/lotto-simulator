"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import KakaoMap from "@/components/KakaoMap"
import NearbySpots from "@/components/NearbySpots"
import { luckySpots, type LuckySpot } from "@/data/luckySpots"
import { getDistance } from "@/lib/getDistance"
import { loadKakaoMapScript } from "@/lib/loadKakaoMapScript"
import { MapPin } from "lucide-react"
// import KakaoAd from "@/components/KakaoAd320x50"
// import KakaoAd2 from "@/components/KakaoAd320x100"
// import KakaoAd320x100 from "@/components/KakaoAd320x100"
// import KakaoAd320x50 from "@/components/KakaoAd320x50"

// 반경 20km 안의 명당
const spotsNear = (lat: number, lng: number) =>
  luckySpots.filter((spot) => getDistance(lat, lng, spot.lat, spot.lng) <= 20)

export default function LuckyMapSection() {
  // 위치를 찾기 전에는 서울시청 주변 명당을 기본으로 표시
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [visibleSpots, setVisibleSpots] = useState<LuckySpot[]>(() => spotsNear(37.5665, 126.978))
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
        const filtered = spotsNear(latitude, longitude)

        setUserLocation({ lat: latitude, lng: longitude })
        setVisibleSpots(filtered.length > 0 ? filtered : luckySpots)
      },
      () => {
        alert("위치 권한을 허용해주세요.")
      }
    )
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* <KakaoAd320x50 /> */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">행운 명당 지도</h2>
          <p className="text-sm text-muted-foreground">최근 1등 당첨 판매점 위치를 알려드릴게요!</p>
        </div>

        <Button
          onClick={handleFindNearby}
          className="w-full h-12 text-base font-mono"
          size="lg"
        >
          <MapPin size={20} className="mr-2" />
          내 주변 명당 찾기
        </Button>

        {sdkLoaded ? (
          <KakaoMap userLocation={userLocation} places={visibleSpots} />
        ) : (
          <p className="text-center text-sm text-gray-500">지도를 불러오는 중입니다...</p>
        )}

        {userLocation && <NearbySpots userLocation={userLocation} />}

        <p className="text-center text-xs text-muted-foreground">출처: 네이버 · 길찾기는 카카오맵 앱이 필요해요</p>
       {/* <KakaoAd320x100 /> */}
      </div>
    </div>
  )
}