"use client"

import { useRef } from "react"
import html2canvas from "html2canvas"
import { Download, Share2 } from "lucide-react"

interface LottoReceiptProps {
  lottoSets: number[][]
}

function getColor(num: number) {
  if (num <= 10) return { bg: "#FDE047", text: "#854D0E" } // 노랑
  if (num <= 20) return { bg: "#3B82F6", text: "#EFF6FF" } // 파랑
  if (num <= 30) return { bg: "#EF4444", text: "#FEE2E2" } // 빨강
  if (num <= 40) return { bg: "#4B5563", text: "#F9FAFB" } // 회색
  return { bg: "#16A34A", text: "#F0FDF4" } // 초록
}

function LottoBall({ number }: { number: number }) {
  const { bg, text } = getColor(number)
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "9999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "14px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        backgroundColor: bg,
        color: text,
      }}
    >
      {number}
    </div>
  )
}

export function LottoReceipt({ lottoSets }: LottoReceiptProps) {
  const now = new Date()
  const receiptRef = useRef<HTMLDivElement>(null)

  const formattedDate = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  const formattedTime = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  const captureImageBlob = async (): Promise<Blob | null> => {
    if (!receiptRef.current) return null

    const canvas = await html2canvas(receiptRef.current, {
      backgroundColor: "#ffffff",
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      ignoreElements: (el) =>
        getComputedStyle(el).opacity === "0" ||
        getComputedStyle(el).visibility === "hidden",
    })

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png")
    })
  }

  const handleDownload = async () => {
    const blob = await captureImageBlob()
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lotto-receipt-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const blob = await captureImageBlob()
    if (!blob) return

    const file = new File([blob], "lotto-receipt.png", { type: "image/png" })

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: "나의 로또 번호",
          text: "이번 주 대박 번호!",
          files: [file],
        })
      } catch (err) {
        console.error("공유 취소 또는 실패", err)
      }
    } else {
      alert("이 기기에서는 공유 기능을 지원하지 않습니다.")
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        ref={receiptRef}
        style={{
          backgroundColor: "#ffffff",
          border: "2px dashed #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            padding: "12px 16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "monospace", fontSize: "12px", letterSpacing: "1px" }}>로또 6/45</div>
          <div style={{ fontWeight: "bold", fontSize: "18px", marginTop: "4px" }}>1등 당첨 복권!</div>
        </div>

        {/* 정보 */}
        <div style={{ padding: "8px 16px", borderBottom: "1px dashed #ccc" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: "12px", color: "#6B7280" }}>
            <span>{formattedDate}</span>
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* 번호 */}
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {lottoSets.map((numbers, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#6B7280" }}>{String.fromCharCode(65 + index)}</span>
                <div style={{ flex: 1, margin: "0 12px", borderTop: "1px dotted #ccc" }}></div>
                <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#6B7280" }}>자동</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                {numbers.map((number, numIndex) => (
                  <LottoBall key={numIndex} number={number} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <div style={{ padding: "12px 16px", borderTop: "1px dashed #ccc", backgroundColor: "#f3f4f6", textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#6B7280" }}>
            총 {lottoSets.length}게임 | 금액 {lottoSets.length * 1000}원
          </div>
          <div style={{ fontSize: "10px", color: "#6B7280" }}>행운을 빕니다!</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
            onClick={handleDownload}
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontWeight: 600,
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center", // 가운데 정렬
              gap: 8, // 아이콘과 텍스트 간격
            }}
          >
            <Download style={{ width: 16, height: 16 }} />
            이미지 저장
          </button>

          <button
            onClick={handleShare}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "6px",
              fontWeight: 600,
              backgroundColor: "#000000",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Share2 style={{ width: 16, height: 16 }} />
            공유하기
          </button>
      </div>
    </div>
  )
}