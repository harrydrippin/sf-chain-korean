const Transaction = require("./transaction");
const Wallet = require("./index");

describe("Transaction", () => {
  let transaction, wallet, recipient, amount;

  beforeEach(() => {
    // 적당한 Transaction을 준비하여 생성시킵니다.
    wallet = new Wallet();
    amount = 50;
    recipient = 'r3c1p13nt';
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  /**
   * 거래 이후 송신자 측 Wallet의 잔고가 `amount` 만큼 감소된다.
   */
  it("outputs the `amount` subtracted from the wallet balance", () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount);
  });

  /**
   * 거래 이후 수신자 측 Wallet의 잔고가 `amount` 만큼 증가한다.
   */
  it("outputs the `amount` added to the recipient", () => {
    expect(transaction.outputs.find(output => output.address === recipient).amount)
      .toEqual(amount);
  });

  /*
   * 이 부분에서 transaction이 undefined라면서 Test가 실패하는 경우가 있습니다.
   * EC가 가지고 있는 Dependency에, 실행 환경이 Browser임을 상정하는 라이브러리가 들어있는 것이 이유입니다.
   * 따라서, package.json에서 Jest에게 현재 Environment가 Node임을 명시해주어야 합니다.
   */

  /**
   * 거래에 보내는 사람 Wallet의 잔고를 넣는다.
   */
  it("inputs the balance of the wallet", () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  /**
   * 유효한 거래를 유효하다고 인식한다.
   */
  it('validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  /**
   * 유효하지 않은 거래를 유효하지 않다고 인식한다.
   */
  it('invalidates a corrupt transaction', () => {
    // Amount를 수정하여 불완전한 거래가 되게 만듭니다.
    transaction.outputs[0].amount = 50000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  /**
   * 잔고를 초과하는 양을 보내려고 시도한 경우
   */
  describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    /**
     * Transaction을 만들지 않는다.
     */
    it('does not create the transaction', () => {
      expect(transaction).toEqual(undefined);
    });
  });

  /**
   * Transaction을 Update하려고 하는 경우
   */
  describe('and updating a transaction', () => {
    let nextAmount, nextRecipient;

    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = "n3xt-4ddr355";
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    /**
     * 보내는 사람의 Output에서 다음 거래의 Amount 만큼을 감소시킨다.
     */
    it(`subtracts the next amount from the sender's output`, () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount - nextAmount);
    });

    /**
     * 다음 거래의 수신자의 Amount을 Outputs에 보유한다.
     */
    it('outputs an amount for the next recipient', () => {
      expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
        .toEqual(nextAmount);
    });
  });
});