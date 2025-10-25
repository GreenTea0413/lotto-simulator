import { useEffect, useState } from 'react'

export const useKakaoLoader = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.kakao && window.kakao.maps) {
      setLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => {
        setLoaded(true)
      })
    }

    document.head.appendChild(script)
  }, [])

  return loaded
}