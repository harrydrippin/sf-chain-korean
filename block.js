/**
 * 블록체인에 달릴 실제 블록에 대한 클래스입니다.
 */
class Block {
  /**
   * Block class의 생성자입니다.
   * @param {*} timestamp 만들어진 시각
   * @param {*} lastHash 직전 Block의 Hash
   * @param {*} hash 지금 만드는 블록의 Hash
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
}

// 이 모듈의 Export에 Block 클래스를 넣습니다.
module.exports = Block;