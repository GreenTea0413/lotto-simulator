// 동행복권 1등 당첨 판매점 수동 수집 스크립트
// 결과를 stdout으로 출력하므로 luckySpots.ts에 직접 붙여넣기 필요
// 자동 업데이트(파일 직접 수정)는 auto_update_spots.mjs 사용
// 사용법: node update_spots.mjs <시작회차> <끝회차>
// 예시: node update_spots.mjs 1213 1220

const [, , startArg, endArg] = process.argv;

if (!startArg || !endArg) {
  console.error("사용법: node update_spots.mjs <시작회차> <끝회차>");
  console.error("예시:   node update_spots.mjs 1213 1220");
  process.exit(1);
}

const startRound = parseInt(startArg);
const endRound = parseInt(endArg);

if (isNaN(startRound) || isNaN(endRound) || startRound > endRound) {
  console.error("올바른 회차 범위를 입력해주세요.");
  process.exit(1);
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWinners(round) {
  const url = `https://www.dhlottery.co.kr/wnprchsplcsrch/selectLtWnShp.do?srchLtEpsd=${round}&srchWnShpRnk=1&srchShpLctn=`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.data?.list?.length) {
    return [];
  }

  return data.data.list
    .filter((item) => item.shpLat && item.shpLot) // 좌표 없는 항목 제외
    .map((item) => ({
      name: item.shpNm,
      address: item.shpAddr.trim(),
      lat: item.shpLat,
      lng: item.shpLot,
    }));
}

async function main() {
  const allResults = [];

  for (let round = startRound; round <= endRound; round++) {
    process.stderr.write(`[${round}회차] 조회 중...\n`);
    const winners = await fetchWinners(round);

    if (winners.length === 0) {
      process.stderr.write(`  -> 데이터 없음 (미추첨 또는 조회 불가)\n`);
    } else {
      process.stderr.write(`  -> ${winners.length}개 판매점 수집\n`);
      allResults.push(...winners);
    }

    if (round < endRound) await delay(300);
  }

  // 중복 제거 (같은 주소 판매점)
  const seen = new Set();
  const unique = allResults.filter((item) => {
    const key = item.address;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  process.stderr.write(`\n총 ${unique.length}개 (중복 제거 후)\n`);

  // luckySpots.ts 형식으로 출력
  const lines = unique
    .map(
      (item) =>
        `  {\n    name: "${item.name}",\n    address: "${item.address}",\n    lat: ${item.lat},\n    lng: ${item.lng},\n  },`
    )
    .join("\n");

  console.log(lines);
  console.log(`  // ${endRound}회까지`);
}

main().catch(console.error);
