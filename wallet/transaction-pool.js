const Transaction = require("../wallet/transaction");

/**
 * Transaction Pool 클래스입니다.
 */
class TransactionPool {
  constructor() {
    // Transaction들이 들어갈 Array입니다.
    this.transactions = [];
  }

  /**
   * 새로운 Transaction을 등록하거나, 이미 있는 경우 이를 갱신합니다.
   * @param {Transaction} transaction 
   */
  updateOrAddTransaction(transaction) {
    // 받은 Transaction과 같은 ID를 가진 거래가 이미 Pool에 있는지 확인합니다.
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    // 존재한다면 == 이미 Pool에 이 Transaction이 올라와있다면
    if (transactionWithId) {
      // 갱신합니다.
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      // 아니라면 새로 만들어줍니다.
      this.transactions.push(transaction);
    }
  }

  /**
   * 주어진 Address를 가지는 Transaction이 이미 존재하는지 확인합니다.
   * @param {string} address 
   */
  existingTransaction(address) {
    return this.transactions.find(t => t.input.address === address);
  }

  /**
   * 유효한 Transaction들을 필터링해서 가져옵니다.
   * 조건 1: Input의 Amount가 Output의 모든 Amount를 합친 것과 같아야 합니다.
   * 조건 2: Signature Verification을 통과해야 합니다.
   */
  validTransactions() {
    return this.transactions.filter(transaction => {
      // Output에 있는 모든 Amount을 합한 값을 얻어옵니다.
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      // Input의 Amount가 Output의 모든 Amount를 합친 것과 같아야 합니다.
      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }

      // Signature Verification을 통과해야 합니다.
      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`);
        return;
      }

      return transaction;
    });
  }
}

module.exports = TransactionPool;