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
});