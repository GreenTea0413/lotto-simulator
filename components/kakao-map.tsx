'use client';

import { useEffect, useRef } from 'react';

type Place = {
  name: string;
  lat: number;
  lng: number;
};

type KakaoMapProps = {
  userLocation: { lat: number; lng: number } | null;
  places: Place[];
};

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap({ userLocation, places }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !mapRef.current) {
      console.warn('[KakaoMap] 아직 로딩 안됨');
      return;
    }

    // SDK 로딩 후에 지도 생성
    window.kakao.maps.load(() => {
      const centerLatLng = userLocation
        ? new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
        : new window.kakao.maps.LatLng(37.5665, 126.9780); // 서울 시청

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: centerLatLng,
        level: 5,
      });

      if (userLocation) {
        new window.kakao.maps.Marker({
          map,
          position: centerLatLng,
          title: '현재 위치',
        });

        new window.kakao.maps.Circle({
          center: centerLatLng,
          radius: 2000,
          strokeWeight: 2,
          strokeColor: '#00aaff',
          strokeOpacity: 0.8,
          fillColor: '#00aaff',
          fillOpacity: 0.2,
          map,
        });
      }

      // 명당 마커
      places.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.lat, place.lng);

        const marker = new window.kakao.maps.Marker({
          map,
          position,
          title: place.name,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${place.name}</div>`,
        });

        window.kakao.maps.event.addListener(marker, 'mouseover', () =>
          infowindow.open(map, marker)
        );
        window.kakao.maps.event.addListener(marker, 'mouseout', () =>
          infowindow.close()
        );
      });
    });
  }, [userLocation, places]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '500px',
        backgroundColor: '#eee',
      }}
    />
  );
}