const Blockchain = require("./index");
const Block = require("./block");

describe('Blockchain', () => {
  let bc, bc2;

  beforeEach(() => {
    // 매 it 전에 새로운 Blockchain 인스턴스를 만들도록 설정합니다.
    bc = new Blockchain();
    bc2 = new Blockchain();
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

  /**
   * 유효한 Chain을 유효하다고 인식한다.
   */
  it("validates a valid chain", () => {
    bc2.addBlock("foo");

    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });

  /**
   * Genesis Block이 올바르지 않은 Chain을 유효하지 않다고 인식한다.
   */
  it("invalidates a chain with a corrupt genesis block", () => {
    bc2.chain[0].data = "Bad data";

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  /**
   * 손상된 Chain을 유효하지 않다고 인식한다.
   */
  it("invalidates a corrupt chain", () => {
    bc2.addBlock("foo");
    bc2.chain[1].data = "Not foo";
    
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  /**
   * 자신의 Chain을 유효한 Chain으로 치환한다.
   */
  it("replaces the chain with a valid chain", () => {
    bc2.addBlock("goo");
    bc.replaceChain(bc2.chain);

    expect(bc.chain).toEqual(bc2.chain);
  });

  /**
   * 자신과 길이가 같거나 더 짧은 Chain으로 치환하지 않는다.
   */
  it("does not replace the chain with one of less than or equal to length", () => {
    bc.addBlock("foo");
    bc.replaceChain(bc2.chain);

    expect(bc.chain).not.toEqual(bc2.chain);
  });
});