"use client"

import { useEffect, useRef } from "react"

type Place = {
  name: string
  lat: number
  lng: number
}

type KakaoMapProps = {
  userLocation: { lat: number; lng: number } | null
  places: Place[]
}

export default function KakaoMap({ userLocation, places }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !mapRef.current) {
      return
    }

    window.kakao.maps.load(() => {
      const centerLatLng = userLocation
        ? new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
        : new window.kakao.maps.LatLng(37.5665, 126.978)

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: centerLatLng,
        level: 5,
      })

      if (userLocation) {
        const markerPosition = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)

        // Canvas로 마커 이미지 생성
        const canvas = document.createElement("canvas")
        canvas.width = 40
        canvas.height = 40
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // 외곽 원
          ctx.beginPath()
          ctx.arc(20, 20, 18, 0, 2 * Math.PI)
          ctx.fillStyle = "#3b82f6"
          ctx.fill()
          ctx.strokeStyle = "white"
          ctx.lineWidth = 3
          ctx.stroke()

          // 내부 원
          ctx.beginPath()
          ctx.arc(20, 20, 8, 0, 2 * Math.PI)
          ctx.fillStyle = "white"
          ctx.fill()
        }

        const imageSrc = canvas.toDataURL()
        const imageSize = new window.kakao.maps.Size(40, 40)
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize)

        new window.kakao.maps.Marker({
          map,
          position: markerPosition,
          image: markerImage,
          title: "현재 위치",
        })

        // 반경 표시
        new window.kakao.maps.Circle({
          center: markerPosition,
          radius: 2000,
          strokeWeight: 2,
          strokeColor: "#3b82f6",
          strokeOpacity: 0.6,
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          map,
        })
      }

      places.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.lat, place.lng)

        // Canvas로 마커 이미지 생성
        const canvas = document.createElement("canvas")
        canvas.width = 36
        canvas.height = 36
        const ctx = canvas.getContext("2d")

        if (ctx) {
          ctx.beginPath()
          ctx.arc(18, 18, 16, 0, 2 * Math.PI)
          ctx.fillStyle = "white"
          ctx.fill()
          ctx.strokeStyle = "#22c55e"
          ctx.lineWidth = 3
          ctx.stroke()

          // 이모지 (클로버) - 가운데 정렬
          ctx.font = "bold 18px Arial"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("🍀", 18, 18)
        }

        const imageSrc = canvas.toDataURL()
        const imageSize = new window.kakao.maps.Size(36, 36)
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize)

        const marker = new window.kakao.maps.Marker({
          map,
          position,
          image: markerImage,
          title: place.name,
        })

        const content = document.createElement("div")
        content.style.cssText = `
          padding: 16px 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
          font-family: 'Courier New', monospace;
          font-size: 16px;
          font-weight: 700;
          color: #000000;
          white-space: nowrap;
          border: 3px solid #22c55e;
          min-width: 120px;
          text-align: center;
          position: relative;
          margin-bottom: 10px;
        `
        content.innerHTML = `🍀 ${place.name}`

        const customOverlay = new window.kakao.maps.CustomOverlay({
          content: content,
          position: position,
          yAnchor: 1.3,
        })

        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          customOverlay.setMap(map)
        })

        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          customOverlay.setMap(null)
        })
      })
    })
  }, [userLocation, places])

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        border: "2px dashed #d1d5db",
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    />
  )
}
