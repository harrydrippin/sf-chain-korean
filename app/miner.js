const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

/**
 * Miner 클래스입니다.
 */
class Miner {
  /**
   * Miner의 생성자입니다.
   * @param {Blockchain} blockchain Blockchain 객체
   * @param {TransactionPool} transactionPool Transaction Pool 객체
   * @param {Wallet} wallet Wallet 객체
   * @param {P2pServer} p2pServer P2P Server 객체
   */
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  /**
   * 채굴을 수행합니다.
   */
  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    // 채굴자에게 줄 보상을 포함시킵니다.
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );

    // 유효한 거래로 구성된 Block을 만듭니다.
    const block = this.blockchain.addBlock(validTransactions);
    
    // P2P 서버에서 Blockchain을 동기화시킵니다.
    this.p2pServer.syncChains();

    // Transaction Pool을 비웁니다.
    this.transactionPool.clear();

    // 모든 채굴자에게 그들의 Transaction Pool을 비우라고 알림
  }
}

module.exports = Miner;