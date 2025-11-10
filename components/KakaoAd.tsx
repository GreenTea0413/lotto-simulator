"use client"

import { useEffect } from "react"

interface KakaoAdProps {
  unitId: string
  width: string
  height: string
  onFailCallback?: string
}

export default function KakaoAd({
  unitId,
  width,
  height,
  onFailCallback,
}: KakaoAdProps) {
  useEffect(() => {
    const ins = document.createElement("ins")
    ins.className = "kakao_ad_area"
    ins.style.display = "none"
    ins.setAttribute("data-ad-unit", unitId)
    ins.setAttribute("data-ad-width", width)
    ins.setAttribute("data-ad-height", height)
    if (onFailCallback) {
      ins.setAttribute("data-ad-onfail", onFailCallback)
    }

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

    // NO-AD fallback 함수 등록 (선택)
    if (onFailCallback) {
      (window as any)[onFailCallback] = (elm: HTMLElement) => {
        elm.innerHTML = "<div style='text-align:center;'>광고를 불러오지 못했습니다</div>"
      }
    }
  }, [unitId, width, height, onFailCallback])

  return <div id={`kakao-ad-container-${unitId}`} className="w-full flex justify-center" />
}