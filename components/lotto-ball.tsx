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
      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
      style={getStyle(number)}
    >
      {number}
    </div>
  )
}