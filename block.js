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

  static mineBlock(lastBlock, data) {
    // Timestamp를 생성합니다.
    const timestamp = Date.now();
    // 이전 Block의 Hash를 꺼내옵니다.
    const lastHash = lastBlock.hash;
    // 지금은 아직 우리의 Hash 함수가 없으므로 임시적으로 지정합니다.
    const hash = "todo-hash";
    // 새로 만들어진 Block을 반환합니다.
    return new this(timestamp, lastHash, hash, data);
  }
}

// 이 모듈의 Export에 Block 클래스를 넣습니다.
module.exports = Block;