// PoW 시스템에 쓰일 Difficulty 상수를 선언합니다.
const DIFFICULTY = 3;

// PoW 시스템에 쓰일 Mining Rate 값을 선언합니다.
// 3초 정도의 시간마다 하나의 Block이 채굴되도록 설정합니다.
const MINE_RATE = 3000;

module.exports = {
  DIFFICULTY, MINE_RATE
};