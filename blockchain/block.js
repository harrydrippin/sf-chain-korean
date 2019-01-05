// SHA-256 함수를 불러옵니다.
const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require("../config");

/**
 * 블록체인에 달릴 실제 블록에 대한 클래스입니다.
 */
class Block {
  /**
   * Block class의 생성자입니다.
   * @param {Date} timestamp 만들어진 시각
   * @param {string} lastHash 직전 Block의 Hash
   * @param {string} hash 지금 만드는 블록의 Hash
   * @param {*} data 지금 만드는 블록에 들어갈 Data
   * @param {string} nonce Nonce 값
   * @param {number} difficulty 채굴 난이도
   */
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    // 지정된 Difficulty가 없을 경우 Default 값을 사용합니다.
    this.difficulty = difficulty || DIFFICULTY;
  }

  /**
   * 이 클래스가 String 형식으로 출력될 때 어떻게 출력될지를 결정합니다.
   */
  toString() {
    // Hash는 길기 때문에 앞부분만 표시합니다.
    return `Block -
      Timestamp  : ${this.timestamp}
      Last Hash  : ${this.lastHash.substring(0, 10)}
      Hash       : ${this.hash.substring(0, 10)}
      Nonce      : ${this.nonce}
      Difficulty : ${this.difficulty}
      Data       : ${this.data}
    `;
  }

  /**
   * Genesis Block을 가져올 수 있는 함수입니다.
   * 인스턴스 없이도 사용할 수 있도록 static이 부여됩니다.
   */
  static genesis() {
    return new this(
      "Genesis time",
      // 이전 Hash는 없습니다.
      "-----",
      // 첫 Hash를 Hardcode합니다.
      "f1r57-h45h",
      // Genesis Block의 데이터로써 빈 Array를 넣습니다.
      [],
      // 최초의 Nonce 값입니다.
      0,
      // 최초의 채굴 난이도 값입니다.
      DIFFICULTY
    );
  }

  /**
   * 기준 Block을 기반으로 새로운 Block을 생성합니다.
   * @param {Block} lastBlock 현재의 마지막 Block
   * @param {*} data Block에 넣을 데이터
   */
  static mineBlock(lastBlock, data) {
    // Hash와 Timestamp를 보관할 변수를 선언합니다.
    let hash, timestamp;
    // 이전 Block의 Hash를 꺼내옵니다.
    const lastHash = lastBlock.hash;
    // 이전 Block에서 채굴 난이도 값을 가져옵니다.
    let { difficulty } = lastBlock;
    // Nonce 값을 보관할 변수를 선언합니다.
    let nonce = 0;
    
    // 적합한 Nonce 값을 찾을 때까지 채굴을 수행합니다.
    do {
      // Nonce 값을 1 증가시킵니다.
      nonce++;
      // 현재의 시간 값을 받아옵니다.
      timestamp = Date.now();
      // 시간이 소요되고 있으므로 매 반복마다 Difficulty를 다시 계산합니다.
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      // Block.hash 함수를 사용하여 현재 Nonce 기준의 Hash를 만듭니다.
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    // 새로 만들어진 Block을 반환합니다.
    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  /**
   * 주어진 데이터를 이용하여 SHA-256 Hash를 만들어냅니다.
   * @param {Date} timestamp timestamp 값
   * @param {string} lastHash lastHash 값
   * @param {*} data data 값
   * @param {string} nonce nonce 값
   * @param {number} difficulty difficulty 값
   */
  static hash(timestamp, lastHash, data, nonce, difficulty) {
    // CryptoJS의 SHA256 함수를 이용하여 Hash를 만들어서 String으로 반환합니다.
    return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  /**
   * 주어진 Block에서 Hash를 계산합니다.
   * @param {Block} block 
   */
  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  /**
   * 채굴 난이도를 시간 값을 기준으로 조절합니다.
   * @param {Block} lastBlock 이전 Block
   * @param {Date} currentTime 채굴 시점의 시각
   */
  static adjustDifficulty(lastBlock, currentTime) {
    // 이전 Block의 채굴 난이도 값을 가져옵니다.
    let { difficulty } = lastBlock;
    // 이전 Block이 생성된 시점으로부터 MINE_RATE초 지난 시점 이전이면 Difficulty를 1 증가시킵니다.
    // 해당 시점 이후이면 너무 오랫동안 Block이 나오지 않고 있으므로 Difficulty를 1 감소시킵니다.
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

// 이 모듈의 Export에 Block 클래스를 넣습니다.
module.exports = Block;