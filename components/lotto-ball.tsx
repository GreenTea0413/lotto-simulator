interface LottoBallProps {
  number: number
}

export function LottoBall({ number }: LottoBallProps) {
  // 번호 범위에 따른 색상 (실제 로또 색상 규칙)
  const getColor = (num: number) => {
    if (num <= 10) return "bg-yellow-400 text-yellow-950"
    if (num <= 20) return "bg-blue-500 text-blue-50"
    if (num <= 30) return "bg-red-500 text-red-50"
    if (num <= 40) return "bg-gray-600 text-gray-50"
    return "bg-green-600 text-green-50"
  }

  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${getColor(
        number,
      )}`}
    >
      {number}
    </div>
  )
}
