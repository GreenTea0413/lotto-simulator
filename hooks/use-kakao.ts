'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

export function useKakaoLoader() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setLoaded(true)
      return
    }

    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
    if (!appKey) {
      console.error('Kakao Map key is missing.')
      return
    }

    if (document.getElementById('kakao-map-sdk')) {
      window.kakao.maps.load(() => setLoaded(true))
      return
    }

    const script = document.createElement('script')
    script.id = 'kakao-map-sdk'
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => setLoaded(true))
    }
    document.head.appendChild(script)
  }, [])

  return loaded
}