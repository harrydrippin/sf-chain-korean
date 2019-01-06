const ChainUtil = require("../chain-util");
const Transaction = require("./transaction");
const { INITIAL_BALANCE } = require("../config");

/**
 * Wallet 클래스입니다.
 */
class Wallet {
  /**
   * Wallet 클래스의 생성자입니다.
   */
  constructor() {
    // Global Variable인 시작 잔고 값을 대입합니다.
    this.balance = INITIAL_BALANCE;
    // Key Pair를 새로 생성하여 대입합니다.
    this.keyPair = ChainUtil.genKeyPair();
    // 생성한 Key Pair에서 Public Key를 가져와 대입합니다.
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  /**
   * 이 클래스가 String 형식으로 출력될 때 어떻게 출력될지를 결정합니다.
   */
  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString()}
      balance   : ${this.balance}`;
  }

  /**
   * 주어진 Hash 값을 이용해서 서명(Signature)을 만들어냅니다.
   * @param {string} dataHash 특정 Data의 Hash 표현
   */
  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  /**
   * Transaction을 만듭니다.
   * @param {string} recipient 수신자
   * @param {number} amount 보내는 양
   * @param {TransactionPool} transactionPool 지정된 Transaction Pool
   */
  createTransaction(recipient, amount, transactionPool) {
    // 잔고보다 많은 양을 송금하려는 경우 이를 막습니다.
    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
      return;
    }

    // 이미 존재하는 Transaction이 있다면 가져옵니다.
    let transaction = transactionPool.existingTransaction(this.publicKey);

    // 있는 경우와 없는 경우를 분기합니다.
    if (transaction) {
      // 있는 경우 기존의 Transaction을 Update합니다.
      transaction.update(this, recipient, amount);
    } else {
      // 없는 경우 새 Transaction을 만듭니다.
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }
}

module.exports = Wallet;