import { LottoBall } from "./LottoBall"

export function LottoReceiptView({
  lottoSets,
  getBorderColor,
}: {
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
    </div>
  )
}
