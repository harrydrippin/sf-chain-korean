const Block = require("./block");

/**
 * Blockchain 클래스입니다.
 */
class Blockchain {
  constructor() {
    // 초기화 시점에서 Chain에 Genesis Block 뿐이도록 만듭니다.
    this.chain = [Block.genesis()];
  }

  /**
   * Blockchain에 새로운 Block을 더합니다.
   * @param {*} data 새로운 Block에 넣을 데이터
   */
  addBlock(data) {
    // Chain에서 마지막 Block을 가져와서 이를 바탕으로 Block을 만듭니다.
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    // Chain에 방금 만든 Block을 넣습니다.
    this.chain.push(block);

    return block;
  }
}

module.exports = Blockchain;