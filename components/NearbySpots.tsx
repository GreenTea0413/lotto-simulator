"use client"

import { luckySpots } from "@/data/luckySpots"
import { getDistance } from "@/lib/getDistance"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Props = {
  userLocation: { lat: number; lng: number } | null
}

export default function NearbySpots({ userLocation }: Props) {
  if (!userLocation) return null

  const top10 = luckySpots
    .map((spot) => ({
      ...spot,
      distance: getDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10)

  return (
    <Card className="p-4 space-y-3">
      <h2 className="flex items-center gap-2 text-sm font-bold font-mono">
        <MapPin size={16} className="text-green-500" />
        가까운 명당 TOP 10
      </h2>
      <ul className="divide-y divide-border">
        {top10.map((spot, idx) => (
          <li key={spot.address} className="flex justify-between items-center gap-3 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {idx + 1}. {spot.name}
              </p>
              <p className="text-xs text-muted-foreground">약 {spot.distance.toFixed(2)} km</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                window.open(
                  `https://map.kakao.com/link/to/${encodeURIComponent(spot.name)},${spot.lat},${spot.lng}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }}
            >
              <Navigation size={14} />
              길찾기
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
