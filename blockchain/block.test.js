const Block = require("./block");
const { DIFFICULTY } = require("../config");

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
    expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
    console.log(block.toString());
  });
});