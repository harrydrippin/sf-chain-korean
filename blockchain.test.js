const Blockchain = require("./blockchain");
const Block = require("./block");

describe('Blockchain', () => {
  let bc;

  beforeEach(() => {
    // 매 it 전에 새로운 Blockchain 인스턴스를 만들도록 설정합니다.
    bc = new Blockchain();
  });

  /**
   * Blockchain은 Genesis Block으로 시작한다.
   */
  it("start with genesis block", () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  /**
   * 새 Block을 추가한다.
   */
  it("adds a new block", () => {
    const data = 'foo';
    bc.addBlock(data);

    // 추가한 블록의 Data가 직접 넣은 Data와 같은지를 확인합니다.
    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });
});