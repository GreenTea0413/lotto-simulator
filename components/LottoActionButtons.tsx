import { ImageDown, Share2, Save, Dices, Trash2 } from "lucide-react"

interface Props {
  onDownload?: () => void
  onShare?: () => void
  onSave?: () => void
  onDelete?: () => void
  onGenerate?: () => void
}

const primaryStyle: React.CSSProperties = { backgroundColor: "#000", color: "#fff", borderColor: "#000" }

export function LottoActionButtons({ onDownload, onShare, onSave, onDelete, onGenerate }: Props) {
  // 저장 버튼이 있으면 저장이 주 동작, 없으면 공유가 주 동작
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      {onDownload && (
        <button onClick={onDownload} style={btnStyle}>
          <ImageDown size={14} />
          이미지
        </button>
      )}

      {onShare && (
        <button onClick={onShare} style={onSave ? btnStyle : { ...btnStyle, ...primaryStyle }}>
          <Share2 size={14} />
          공유
        </button>
      )}

      {onSave && (
        <button onClick={onSave} style={{ ...btnStyle, ...primaryStyle }}>
          <Save size={14} />
          저장
        </button>
      )}

      {onGenerate && (
        <button onClick={onGenerate} style={btnStyle}>
          <Dices size={14} />
          생성
        </button>
      )}

      {onDelete && (
        <button onClick={onDelete} style={{ ...btnStyle, flex: "none", border: "none", color: "#ef4444" }}>
          <Trash2 size={14} />
          삭제하기
        </button>
      )}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontWeight: 600,
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  gap: 8,
}