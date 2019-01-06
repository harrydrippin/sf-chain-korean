const ChainUtil = require("../chain-util");
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
}

module.exports = Wallet;