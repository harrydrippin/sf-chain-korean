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
}

module.exports = TransactionPool;