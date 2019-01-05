// SHA-256 함수를 불러옵니다.
const SHA256 = require('crypto-js/sha256');

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
   */
  constructor(timestamp, lastHash, hash, data) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  /**
   * 이 클래스가 String 형식으로 출력될 때 어떻게 출력될지를 결정합니다.
   */
  toString() {
    // Hash는 길기 때문에 앞부분만 표시합니다.
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Data      : ${this.data}
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
      []
    );
  }

  /**
   * 기준 Block을 기반으로 새로운 Block을 생성합니다.
   * @param {Block} lastBlock 현재의 마지막 Block
   * @param {*} data Block에 넣을 데이터
   */
  static mineBlock(lastBlock, data) {
    // Timestamp를 생성합니다.
    const timestamp = Date.now();
    // 이전 Block의 Hash를 꺼내옵니다.
    const lastHash = lastBlock.hash;
    // Block.hash 함수를 사용하여 현재 Block의 Hash를 만듭니다.
    const hash = Block.hash(timestamp, lastHash, data);

    // 새로 만들어진 Block을 반환합니다.
    return new this(timestamp, lastHash, hash, data);
  }

  /**
   * 주어진 데이터를 이용하여 SHA-256 Hash를 만들어냅니다.
   * @param {Date} timestamp Timestamp 값
   * @param {string} lastHash lastHash 값
   * @param {*} data data 값
   */
  static hash(timestamp, lastHash, data) {
    // CryptoJS의 SHA256 함수를 이용하여 Hash를 만들어서 String으로 반환합니다.
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }
}

// 이 모듈의 Export에 Block 클래스를 넣습니다.
module.exports = Block;