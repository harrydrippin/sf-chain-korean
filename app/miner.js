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
    // 채굴자에게 줄 보상을 포함시킴
    // 유효한 거래로 구성된 Block을 만듬
    // P2P 서버에서 Blockchain을 동기화시킴
    // Transaction Pool을 비움
    // 모든 채굴자에게 그들의 Transaction Pool을 비우라고 알림
  }
}

module.exports = Miner;