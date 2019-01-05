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

  /**
   * Chain이 유효한지 확인합니다.
   * 조건 1: 첫 Block이 Genesis Block이어야 합니다.
   * 조건 2: 각 Block에 대하여 이전 Block의 Hash와 lastHash 값이 같아야 합니다.
   * 조건 3: 각 Block에 대하여 Block이 가진 Hash와 해당 Block으로 생성된 Hash가 같아야 합니다.
   * @param {Array<Block>} chain Blockchain 정보를 담고 있는 Array
   */
  isValidChain(chain) {
    // 첫 Block이 Genesis인지 확인하고, 그렇지 않으면 유효하지 않은 것으로 판단합니다.
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

    // Chain에 있는 Genesis Block을 제외한 모든 Block들에 대하여 반복합니다.
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      // 이전 Block의 Hash와 lastHash 값이 같지 않으면 유효하지 않은 것으로 판단합니다.
      if (block.lastHash !== lastBlock.hash) return false;
      
      // Block이 가진 Hash와 해당 Block으로 생성된 Hash가 같지 않으면 유효하지 않은 것으로 판단합니다.
      if (block.hash !== Block.blockHash(block)) return false;
    }

    // 모든 조건을 통과했을 경우 True를 반환합니다.
    return true;
  }
}

module.exports = Blockchain;