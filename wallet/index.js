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
    this.keyPair = null;
    this.publicKey = null;
  }

  /**
   * 이 클래스가 String 형식으로 출력될 때 어떻게 출력될지를 결정합니다.
   */
  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString()}
      balance   : ${this.balance}`;
  }
}

module.exports = Wallet;