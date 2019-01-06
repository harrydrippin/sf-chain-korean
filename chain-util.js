const EC = require("elliptic").ec;
// Bitcoin에서 쓰는 Elliptic Curve를 불러옵니다.
const ec = new EC("secp256k1");

class ChainUtil {
  /**
   * elliptic 모듈을 이용해서 KeyPair를 생성해냅니다.
   */
  static genKeyPair() {
    return ec.genKeyPair();
  }
}

module.exports = ChainUtil;