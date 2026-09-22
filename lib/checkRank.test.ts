// 실행: npx tsx lib/checkRank.test.ts
import assert from "node:assert"
import { getRank, bestRank } from "./checkRank"

const w = { numbers: [1, 2, 3, 4, 5, 6], bonus: 7 }
assert.equal(getRank([1, 2, 3, 4, 5, 6], w), "1등")
assert.equal(getRank([1, 2, 3, 4, 5, 7], w), "2등")
assert.equal(getRank([1, 2, 3, 4, 5, 8], w), "3등")
assert.equal(getRank([1, 2, 3, 4, 9, 8], w), "4등")
assert.equal(getRank([1, 2, 3, 10, 9, 8], w), "5등")
assert.equal(getRank([1, 2, 7, 10, 9, 8], w), "꽝")
assert.equal(bestRank(["꽝", "4등", "2등", "5등"]), "2등")
assert.equal(bestRank([]), "꽝")
console.log("ok")
