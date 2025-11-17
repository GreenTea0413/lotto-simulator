"use client"

import { useEffect } from "react"

export default function KakaoAd160x600() {
  useEffect(() => {
    const unitId = "DAN-9QMXrkY6XeOU67SQ" // 160x600 광고 유닛
    const width = 160
    const height = 600
    const onFailCallback = "handleAdFail160x600"

    const ins = document.createElement("ins")
    ins.className = "kakao_ad_area"
    ins.style.display = "none"
    ins.setAttribute("data-ad-unit", unitId)
    ins.setAttribute("data-ad-width", width.toString())
    ins.setAttribute("data-ad-height", height.toString())
    ins.setAttribute("data-ad-onfail", onFailCallback)

    const script = document.createElement("script")
    script.async = true
    script.type = "text/javascript"
    script.charset = "utf-8"
    script.src = "https://t1.daumcdn.net/kas/static/ba.min.js"

    const container = document.getElementById(`kakao-ad-container-${unitId}`)
    if (container && container.children.length === 0) {
      container.appendChild(ins)
      container.appendChild(script)
    }

    // NO-AD fallback 함수
    ;(window as any)[onFailCallback] = (elm: HTMLElement) => {
      elm.innerHTML = "<div style='text-align:center;font-size:12px;color:#999;'>광고를 불러오지 못했습니다</div>"
    }
  }, [])

  return (
    <div 
      id="kakao-ad-container-DAN-9QMXrkY6XeOU67SQ" 
      className="flex justify-center items-start"
      style={{ width: '160px', minHeight: '600px' }}
    />
  )
}