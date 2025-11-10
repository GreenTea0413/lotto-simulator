"use client"

import { useEffect } from "react"

export default function KakaoAd320x50() {
  useEffect(() => {
    const unitId = "DAN-QdWAILcwQ2JIWqZn"
    const width = 320
    const height = 50
    const onFailCallback = "handleAdFail1"

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
      elm.innerHTML = "<div style='text-align:center;'>광고를 불러오지 못했습니다</div>"
    }
  }, [])

  return <div id="kakao-ad-container-DAN-QdWAILcwQ2JIWqZn" className="w-full flex justify-center" />
}