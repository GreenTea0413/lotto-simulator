import { LatestResults } from "@/components/LatestResults"
import { LottoGenerator } from "@/components/LottoGenerator"
import { fetchLatestLotto } from "@/lib/fetchLatestLotto"
// import KakaoAd320x50 from "@/components/KakaoAd320x50"
// import KakaoAd320x100 from "@/components/KakaoAd320x100"

// 최신 당첨번호를 HTML에 담아 정적으로 내려주고 10분마다 갱신
export const revalidate = 600

export default async function Home() {
  // 실패하면 null → 클라이언트에서 /api/lotto/latest로 다시 요청
  const latest = await fetchLatestLotto().catch(() => null)

  return (
    <div className="py-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        {/* <KakaoAd320x50 /> */}
        <h1 className="sr-only">로또 6/45 번호 생성기</h1>
        <LatestResults initial={latest} />
        <LottoGenerator />
        {/* <KakaoAd320x100 /> */}
      </div>
    </div>
  )
}
