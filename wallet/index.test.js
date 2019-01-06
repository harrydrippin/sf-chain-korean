const Wallet = require("./index");
const TransactionPool = require("./transaction-pool");
const Blockchain = require("../blockchain");
const { INITIAL_BALANCE } = require("../config");

describe("Wallet", () => {
  let wallet, tp, bc;

  beforeEach(() => {
    // Wallet과 Transaction Pool을 생성합니다.
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new Blockchain();
  });

  /**
   * Transaction을 만드는 경우
   */
  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      // 특정 수신자에게 50만큼을 보내는 Transaction을 만듭니다.
      sendAmount = 50;
      recipient = "r4nd0m-4ddr355";
      transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
    });

    /**
     * 그리고 같은 Transaction을 한 번 더 하는 경우
     */
    describe("and doing the same transaction", () => {
      beforeEach(() => {
        // 위의 정보로 하나의 Transaction을 더 만듭니다.
        wallet.createTransaction(recipient, sendAmount, bc, tp);
      });

      /**
       * sendAmount의 2배(100)가 송신자의 지갑에서 감소한다.
       */
      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - sendAmount * 2);
      });

      /**
       * 수신자에게 sendAmount 만큼이 보내지는 Output이 복사된다.
       */
      it("clones the `sendAmount` output for the recipient", () => {
        expect(transaction.outputs.filter(output => output.address === recipient)
          .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
      });
    });
  });

  /**
   * 잔고를 계산하는 경우
   */
  describe("calculating a balance", () => {
    let addBalance, repeatAdd, senderWallet;

    beforeEach(() => {
      // Transaction을 몇 개 만들어서 Balance가 변하게 합니다.
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;
      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
      }
      bc.addBlock(tp.transactions);
    });

    /**
     * 지금까지의 수신자 이름이 있는 Block을 이용하여 그에 맞는 Balance를 계산해낸다.
     */
    it("calculates the balance for blockchain transactions matching the recipient", () => {
      expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
    });

    /**
     * 지금까지의 발신자 이름이 있는 Block을 이용하여 그에 맞는 Balance를 계산해낸다.
     */
    it("calculates the balance for blockchain transactions matching the sender", () => {
      expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
    });
    
    /**
     * 그리고 수신자가 거래를 수행했을 경우
     */
    describe('and the recipient conducts a transaction', () => {
      let subtractBalance, recipientBalance;

      beforeEach(() => {
        // Pool을 비웁니다.
        tp.clear();
        subtractBalance = 60;
        recipientBalance = wallet.calculateBalance(bc);
        wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
        bc.addBlock(tp.transactions);
      });
      
      /**
       * 그리고 발신자가 또 다른 거래를 수신자에게 수행했을 경우
       */
      describe('and the sender sends another transaction to the recipient', () => {
        beforeEach(() => {
          tp.clear();
          senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
          bc.addBlock(tp.transactions);
        });

        /**
         * 최근의 Block인 마지막 Block만을 사용해서 수신자의 잔고를 계산한다.
         */
        it('calculate the recipient balance only using transactions since its most recent one', () => {
          expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
        });
      });
    });
  });
});