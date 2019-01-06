const Wallet = require("./index");
const TransactionPool = require("./transaction-pool");

describe("Wallet", () => {
  let wallet, tp;

  beforeEach(() => {
    // Wallet과 Transaction Pool을 생성합니다.
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  /**
   * Transaction을 만드는 경우
   */
  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      // 특정 수신자에게 50만큼을 보내는 Transaction을 만듭니다.
      sendAmount = 50;
      recipient = "r4nd0m-4ddr355";
      transaction = wallet.createTransaction(recipient, sendAmount, tp);
    });

    /**
     * 그리고 같은 Transaction을 한 번 더 하는 경우
     */
    describe("and doing the same transaction", () => {
      beforeEach(() => {
        // 위의 정보로 하나의 Transaction을 더 만듭니다.
        wallet.createTransaction(recipient, sendAmount, tp);
      });

      /**
       * sendAmount의 2배(100)가 송신자의 지갑에서 감소한다.
       */
      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - sendAmount * 2);
      });

      /**
       * 수신자에게 sendAmount 만큼이 보내지는 Output이 복사된다.
       */
      it("clones the `sendAmount` output for the recipient", () => {
        expect(transaction.outputs.filter(output => output.address === recipient)
          .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});