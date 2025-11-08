import { LottoBall } from "./LottoBall"

export function LottoReceiptView({
  timestamp,
  lottoSets,
  getBorderColor,
}: {
  timestamp: string
  lottoSets: number[][]
  getBorderColor?: (set: number[]) => string | undefined
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#000",
          color: "#fff",
          padding: "12px 16px",
          textAlign: "center",
        }}
      >
        <p style={{ fontFamily: "monospace", fontSize: 12 }}>로또 6/45</p>
        <p style={{ fontWeight: "bold", fontSize: 18, marginTop: 4 }}>
          1등 당첨 복권!
        </p>
      </div>

      <div style={{ padding: "8px 16px", borderBottom: "1px dashed #ccc" }}>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: "#6B7280",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <span>{timestamp.split(" ")[0]}</span>
          <span>{timestamp.split(" ")[1]}</span>
          <span>{timestamp.split(" ")[2]}</span>
        </p>
      </div>

      <div style={{ padding: "16px" }}>
        {lottoSets.map((row, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${getBorderColor ? getBorderColor(row) : "border border-gray-200"}`}
          >
            <div className="flex justify-between mb-2 text-xs font-mono">
              <span>{String.fromCharCode(65 + idx)}</span>
              <span>자동</span>
            </div>
            <div className="flex gap-2 justify-center">
              {row.map((num, i) => (
                <LottoBall key={i} number={num} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "12px 16px",
          backgroundColor: "#f3f4f6",
          borderTop: "1px dashed #ccc",
          textAlign: "center",
          fontSize: 12,
          color: "#6B7280",
          fontFamily: "monospace",
        }}
      >
        총 {lottoSets.length}게임 | {lottoSets.length * 1000}원
        <div style={{ fontSize: 10 }}>행운을 빕니다!</div>
      </div>
    </div>
  )
}
