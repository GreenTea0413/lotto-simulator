"use client"

import { useEffect } from "react"

export default function KakaoAd320x100() {
  useEffect(() => {
    const unitId = "DAN-TZ3pdLaJ0ILt97Kp"
    const width = 320
    const height = 100
    const onFailCallback = "handleAdFail2"

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

  return <div id="kakao-ad-container-DAN-TZ3pdLaJ0ILt97Kp" className="w-full flex justify-center" />
}