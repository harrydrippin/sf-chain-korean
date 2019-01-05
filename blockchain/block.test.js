const Block = require("./block");

/**
 * Block 클래스에 대한 테스트를 정의합니다.
 * Jest를 사용합니다.
 */
describe('Block', () => {
  let data, lastBlock, block;

  /**
   * 테스트를 하기 전에 미리 호출되는 함수입니다.
   * 적절한 Data와 lastBlock을 만들고, 이를 통해 Block을 하나 생성해둡니다.
   */
  beforeEach(() => {
    data = 'bar';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  /**
   * 생성된 Block의 Data가 실제 Data와 일치한다.
   */
  it("sets the `data` to match the input", () => {
    expect(block.data).toEqual(data);
  });

  /**
   * 생성된 Block의 lastHash가 실제로 마지막 Block의 Hash와 일치한다.
   */
  it("sets the `lastHash` to match the hash of the last block", () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  /**
   * Difficulty 상수에 맞는 Hash를 생성해낸다.
   */
  it("generates a hash that matches the difficulty", () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    console.log(block.toString());
  });

  /**
   * 느리게 채굴되는 Block의 채굴 난이도를 낮추어준다.
   */
  it("lowers the difficulty for slowly mined blocks", () => {
    // Block이 채굴되기 시작한지 1시간 뒤를 상정합니다.
    expect(Block.adjustDifficulty(block, block.timestamp + 36000))
      .toEqual(block.difficulty - 1);
  });

  /**
   * 빠르게 채굴되는 Block의 채굴 난이도를 높여준다.
   */
  it("raises the difficulty for quickly mined blocks", () => {
    // Block이 채굴되기 시작한지 0.001초 뒤를 상정합니다.
    expect(Block.adjustDifficulty(block, block.timestamp + 1))
      .toEqual(block.difficulty + 1);
  });
});