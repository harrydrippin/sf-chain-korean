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
   * @param {Blockchain} blockchain Blockchain 객체
   * @param {TransactionPool} transactionPool 지정된 Transaction Pool
   */
  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);

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

  /**
   * Wallet의 잔고를 계산합니다.
   * @param {Blockchain} blockchain 지금까지의 모든 Block이 걸린 Blockchain
   */
  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];

    // Transaction을 모두 추출해 Array에 넣습니다.
    blockchain.chain.forEach(block => {
      block.data.forEach(transaction => {
        transactions.push(transaction);
      });
    });

    // Input이 자신인 Transaction들을 가져옵니다.
    const walletInputTs = transactions
      .filter(transaction => transaction.input.address === this.publicKey); 
    
    // Output을 보기 시작할 시간을 보관할 변수입니다.
    let startTime = 0;

    if (walletInputTs.length > 0) {
      // 가장 최근의 Transaction을 가져옵니다.
      const recentInputT = walletInputTs.reduce(
        (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
      );

      // 최근의 Transaction에서 Balance을 가져옵니다.
      balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
      // Input Balance가 갱신된 시간을 가져옵니다.
      startTime = recentInputT.input.timestamp;
    }

    // 이후 Transaction들을 가져오며 startTime 이후에 시작된 모든 Transaction들에 대하여 Output의 잔고를 더합니다.
    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  /**
   * Blockchain Wallet을 만듭니다.
   */
  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
}

module.exports = Wallet;