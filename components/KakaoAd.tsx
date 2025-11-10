'use client'

import { useEffect, useRef } from 'react'

export default function KakaoBannerAd() {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      if (window && (window as any).kakao && (window as any).kakao.adfit) {
        (window as any).kakao.adfit.load()
      }
    } catch (e) {
      console.error('카카오 배너 광고 로딩 실패', e)
    }
  }, [])

  return (
    <div
      ref={adRef}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[320px] h-[50px] z-50"
    >
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit="DAN-QdWAILcwQ2JIWqZn"
        data-ad-width="320"
        data-ad-height="50"
      ></ins>
    </div>
  )
}