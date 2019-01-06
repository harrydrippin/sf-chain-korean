const EC = require("elliptic").ec;
const SHA256 = require('crypto-js/sha256');
const uuidV1 = require("uuid/v1");

// Bitcoin에서 쓰는 Elliptic Curve인 SECP256K1을 불러옵니다.
const ec = new EC("secp256k1");

class ChainUtil {
  /**
   * elliptic 모듈을 이용해서 KeyPair를 생성합니다.
   */
  static genKeyPair() {
    return ec.genKeyPair();
  }

  /**
   * UUID를 생성합니다.
   */
  static id() {
    return uuidV1();
  }

  /**
   * 주어진 data를 통해 Hash 값을 만듭니다.
   * @param {object} data 데이터
   */
  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }
}

module.exports = ChainUtil;