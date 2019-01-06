const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./index");

describe("TransactionPool", () => {
  let tp, wallet, transaction;

  beforeEach(() => {
    // Transaction을 하나 생성하고 이를 Pool에 넣는 작업을 수행합니다.
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, 'r4nd-4dr355', 30);
    tp.updateOrAddTransaction(transaction);
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
  })
});