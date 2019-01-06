const EC = require("elliptic").ec;
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
}

module.exports = ChainUtil;