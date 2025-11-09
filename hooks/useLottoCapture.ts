import html2canvas from "html2canvas-pro"
import { RefObject } from "react"

export function useLottoCapture(ref: RefObject<HTMLElement | null>) {
  const captureImageBlob = async (): Promise<Blob | null> => {
    if (!ref.current) return null
    const canvas = await html2canvas(ref.current, {
      backgroundColor: "#ffffff",
      scale: window.devicePixelRatio || 2,
      useCORS: true,
    })
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png")
    })
  }

  const downloadImage = async () => {
    const blob = await captureImageBlob()
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lotto-receipt-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareImage = async () => {
    const blob = await captureImageBlob()
    if (!blob) return
    const file = new File([blob], "lotto-receipt.png", { type: "image/png" })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: "나의 로또 번호", files: [file] })
      alert("공유 완료!")
    } else {
      alert("이 기기에서는 이미지 공유를 지원하지 않습니다.")
    }
  }

  return { downloadImage, shareImage }
}