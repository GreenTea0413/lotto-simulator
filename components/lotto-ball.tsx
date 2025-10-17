"use client"

interface LottoBallProps {
  number: number
}

export function LottoBall({ number }: LottoBallProps) {
  const getStyle = (num: number) => {
    if (num <= 10)
      return {
        backgroundColor: "#facc15", // yellow-400
        color: "#422006",           // yellow-950
      }
    if (num <= 20)
      return {
        backgroundColor: "#3b82f6", // blue-500
        color: "#f0f9ff",           // blue-50
      }
    if (num <= 30)
      return {
        backgroundColor: "#ef4444", // red-500
        color: "#fef2f2",           // red-50
      }
    if (num <= 40)
      return {
        backgroundColor: "#52525b", // gray-600
        color: "#f9fafb",           // gray-50
      }
    return {
      backgroundColor: "#16a34a", // green-600
      color: "#f0fdf4",           // green-50
    }
  }

  return (
    <div
      style={{
        ...getStyle(number),
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        textAlign: "center",
        lineHeight: "36px", 
        fontWeight: "bold",
        fontSize: "14px",
        fontFamily: "system-ui, sans-serif", 
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        position: "relative",
        top: "-0.5px",
      }}
    >
      {number}
    </div>
  )
}