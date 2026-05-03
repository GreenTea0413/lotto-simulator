// 로또 1등 당첨 판매점 자동 업데이트 스크립트 (GitHub Actions용)
// 현재 날짜 기반으로 최신 회차를 계산하고 luckySpots.ts를 자동 업데이트

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function getCurrentRound() {
  // 1회차: 2002-12-07 (토요일 KST)
  const start = new Date('2002-12-07T00:00:00+09:00');
  const now = new Date();
  const daysSince = (now - start) / (1000 * 60 * 60 * 24);
  return Math.floor(daysSince / 7) + 1;
}

function getLastRegisteredRound(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const matches = [...content.matchAll(/\/\/ (\d+)회까지/g)];
  if (matches.length === 0) return 0;
  return parseInt(matches[matches.length - 1][1]);
}

async function fetchWinners(round) {
  const url = `https://www.dhlottery.co.kr/wnprchsplcsrch/selectLtWnShp.do?srchLtEpsd=${round}&srchWnShpRnk=1&srchShpLctn=`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.data?.list?.length) return [];

  return data.data.list
    .filter((item) => item.shpLat && item.shpLot)
    .filter((item) => item.shpAddr && !item.shpAddr.includes('dhlottery')) // 온라인 제외
    .map((item) => ({
      name: item.shpNm,
      address: item.shpAddr.trim(),
      lat: item.shpLat,
      lng: item.shpLot,
    }));
}

async function main() {
  const filePath = join(__dirname, 'data', 'luckySpots.ts');

  const currentRound = getCurrentRound();
  const lastRound = getLastRegisteredRound(filePath);

  console.log(`현재 회차: ${currentRound}`);
  console.log(`마지막 등록 회차: ${lastRound}`);

  if (lastRound >= currentRound) {
    console.log('업데이트할 새 회차가 없습니다.');
    process.exit(0);
  }

  const startRound = lastRound + 1;
  const endRound = currentRound;

  console.log(`\n${startRound}회 ~ ${endRound}회 데이터 수집 시작...`);

  const allResults = [];

  for (let round = startRound; round <= endRound; round++) {
    console.log(`[${round}회차] 조회 중...`);
    const winners = await fetchWinners(round);

    if (winners.length === 0) {
      console.log(`  -> 데이터 없음 (미추첨 또는 조회 불가)`);
    } else {
      console.log(`  -> ${winners.length}개 판매점 수집`);
      allResults.push(...winners);
    }

    if (round < endRound) await delay(300);
  }

  if (allResults.length === 0) {
    console.log('\n수집된 데이터가 없습니다. 업데이트 없음.');
    process.exit(0);
  }

  // 중복 제거 (같은 주소)
  const seen = new Set();
  const unique = allResults.filter((item) => {
    if (seen.has(item.address)) return false;
    seen.add(item.address);
    return true;
  });

  console.log(`\n총 ${unique.length}개 (중복 제거 후)`);

  // luckySpots.ts 파일 업데이트
  const content = readFileSync(filePath, 'utf-8');
  const oldTail = `  // ${lastRound}회까지\n]`;

  const newEntries = unique
    .map(
      (item) =>
        `  {\n    name: "${item.name}",\n    address: "${item.address}",\n    lat: ${item.lat},\n    lng: ${item.lng},\n  },`
    )
    .join('\n');

  const newTail = `  // ${lastRound}회까지\n${newEntries}\n  // ${endRound}회까지\n]`;

  if (!content.includes(oldTail)) {
    console.error(`오류: "${oldTail}" 패턴을 파일에서 찾을 수 없습니다.`);
    process.exit(1);
  }

  const newContent = content.replace(oldTail, newTail);
  writeFileSync(filePath, newContent, 'utf-8');

  console.log(`\n✅ data/luckySpots.ts 업데이트 완료 (${endRound}회까지)`);
  // GitHub Actions에서 커밋 메시지에 사용
  console.log(`UPDATED_ROUND=${endRound}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
