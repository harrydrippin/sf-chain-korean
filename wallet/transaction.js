const ChainUtil = require("../chain-util");

/**
 * Transaction 클래스입니다.
 */
class Transaction {
  /**
   * Transaction 클래스의 생성자입니다.
   */
  constructor() {
    // UUID를 통해 Unique한 ID를 부여합니다.
    this.id = ChainUtil.id();
    // 거래의 Input을 넣습니다.
    this.input = null;
    // 거래의 Output이 담길 Array를 넣습니다.
    this.outputs = [];
  }

  /**
  * Transaction을 Update합니다.
  * @param {Wallet} senderWallet 보내는 사람의 지갑
  * @param {string} recipient 받는 사람의 주소
  * @param {number} amount 보내는 양
  */
  update(senderWallet, recipient, amount) {
    // 해당하는 Sender의 Output을 찾아냅니다.
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    // 이미 기록된 Amount보다 더 많은 양이 송금되려고 할 경우 이를 막습니다.
    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    // 추가로 명시된 Amount만큼을 감소시킵니다.
    senderOutput.amount = senderOutput.amount - amount;
    // 새로운 Output을 넣어줍니다.
    this.outputs.push({ amount, address: recipient });
    // Transaction에 서명합니다.
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  /**
   * 새로운 Transaction을 생성합니다.
   * @param {Wallet} senderWallet 보내는 사람의 지갑
   * @param {string} recipient 받는 사람의 주소
   * @param {number} amount 보내는 양
   */
  static newTransaction(senderWallet, recipient, amount) {
    // 새로운 Transaction 객체를 만듭니다.
    const transaction = new this();
    
    // 지금 가진 잔고보다 더 많은 돈을 보내는 것은 아닌지 확인합니다.
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    // Transaction의 Output을 만듭니다.
    transaction.outputs.push(...[
      // 송신자의 Balance를 갱신하는 Output입니다.
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      // 수신자에게 돈을 보내는 것을 확인하는 Outputㅇ비니다.
      { amount, address: recipient }
    ]);

    // 만들어진 Transaction에 서명하여 Input을 채워넣습니다.
    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }

  /**
   * 주어진 Transaction에 서명합니다.
   * @param {Transaction} transaction 
   * @param {Wallet} senderWallet 
   */
  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      // Transaction의 Output에 대한 서명을 첨부합니다.
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    }
  }

  /**
   * 거래의 서명이 옳은지 검사합니다.
   * @param {Transaction} transaction 
   */
  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address, 
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;