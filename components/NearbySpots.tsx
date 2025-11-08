"use client"

import { luckySpots } from "@/data/luckySpots"
import { getDistance } from "@/lib/getDistance"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  userLocation: { lat: number; lng: number } | null
}

export default function NearbySpots({ userLocation }: Props) {
  if (!userLocation) return null

  const top3 = luckySpots
    .map((spot) => ({
      ...spot,
      distance: getDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)

  return (
    <div style={{ marginTop: "24px" }}>
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          fontFamily: "'Courier New', monospace",
          marginBottom: "16px",
          color: "#1f2937",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <MapPin size={20} style={{ color: "#22c55e" }} />
        가까운 명당 TOP 3
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {top3.map((spot, idx) => (
          <div
            key={spot.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "white",
              padding: "16px",
              borderRadius: "8px",
              border: "2px dashed #d1d5db",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#22c55e"
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#d1d5db"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)"
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: "600",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "15px",
                  color: "#1f2937",
                  marginBottom: "4px",
                }}
              >
                {idx + 1}. {spot.name}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                약 {spot.distance.toFixed(2)} km
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                window.open(
                  `https://map.kakao.com/link/to/${encodeURIComponent(spot.name)},${spot.lat},${spot.lng}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }}
              style={{
                fontFamily: "'Courier New', monospace",
              }}
            >
              <Navigation size={14} />
              길찾기
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
