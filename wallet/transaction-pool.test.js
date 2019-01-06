const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");
const Blockchain = require("../blockchain");

describe("TransactionPool", () => {
  let tp, wallet, transaction, bc;

  beforeEach(() => {
    // Transaction을 하나 생성하고 이를 Pool에 넣는 작업을 수행합니다.
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain();

    // Wallet의 함수를 이용해 Transaction을 만듭니다.
    transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp);
  });

  /**
   * Transaction을 Pool에 넣는다.
   */
  it("adds a transaction to the pool", () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  /**
   * Pool에 있는 Transaction을 갱신한다.
   */
  it("updates a transaction in the pool", () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
    tp.updateOrAddTransaction(newTransaction);

    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });

  /**
   * Transaction Pool을 비운다.
   */
  it('clears transactions', () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  })

  /**
   * 유효한 거래와 유효하지 않은 거래가 섞여있는 경우
   */
  describe("mixing valid and corrupt transactions", () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...tp.transactions];
      // 6개의 가짜 Transaction을 만듭니다.
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp);
        if (i % 2 == 0) {
          // 짝수 번째의 Transaction을 유효하지 않도록 만듭니다.
          transaction.input.amount = 99999;
        } else {
          // 홀수 번째는 Valid하다고 인정합니다.
          validTransactions.push(transaction);
        }
      }
    });

    /**
     * 유효한 Transaction과 그렇지 않은 것 사이의 차이를 보인다.
     */
    it("shows a difference between valid and corrupt transactions", () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    /**
     * 유효한 Transaction을 골라낸다.
     */
    it("grabs valid transactions", () => {
      expect(tp.validTransactions()).toEqual(validTransactions);
    });
  });
});