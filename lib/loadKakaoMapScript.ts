'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

export function loadKakaoMapScript(callback: () => void) {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
  if (!appKey) {
    console.error('Kakao Map key is missing.')
    return
  }

  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(callback)
    return
  }

  if (document.getElementById('kakao-map-sdk')) {
    const existingScript = document.getElementById('kakao-map-sdk') as HTMLScriptElement

    if (typeof window.kakao === 'undefined') {
      existingScript.onload = () => {
        window.kakao.maps.load(callback)
      }
    } else if (window.kakao.maps) {
      window.kakao.maps.load(callback)
    }

    return
  }
  
  const script = document.createElement('script')
  script.id = 'kakao-map-sdk'
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`
  script.async = true
  script.onload = () => {
    window.kakao.maps.load(callback)
  }

  document.head.appendChild(script)
}