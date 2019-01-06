const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain");
const P2pServer = require("./p2p-server");
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transaction-pool");

// 이 서버가 어느 포트에 열릴지를 결정합니다.
// 기본적으로 환경 변수를 따라가며, 없을 경우 3001을 기본으로 합니다.
const HTTP_PORT = process.env.HTTP_PORT || 3001;

// Express Application과 P2P Server를 선언합니다.
const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);

// POST 요청에서 JSON을 Body로 받을 수 있도록 Middleware를 설정합니다.
app.use(bodyParser.json());

/**
 * Blockchain이 가진 Block들을 반환하는 API입니다.
 */
app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

/**
 * Block을 Chain에 더하는 API입니다.
 */
app.post("/mine", (req, res) => {
  // POST 요청에 같이 올라온 Block을 Chain에 더합니다.
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  // 갱신된 Chain을 Peer들에게 보내줍니다.
  p2pServer.syncChains();

  // GET blocks로 리디렉션합니다.
  res.redirect("/blocks");
});

/**
 * Transaction Pool 전체를 보여주는 API입니다.
 */
app.get("/transactions", (req, res) => {
  res.json(tp.transactions);
});

/**
 * Transaction을 보내는 API입니다.
 */
app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  // Transaction을 만듭니다.
  const transaction = wallet.createTransaction(recipient, amount, tp);
  // 넘어온 메시지에 들어있는 Transaction을 Broadcast합니다.
  p2pServer.broadcastTransaction(transaction);
  // GET transactions로 리디렉션합니다.
  res.redirect("/transactions");
});

/**
 * 자신의 Public Key를 보여주는 API입니다.
 */
app.get("/public-key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

// 주어진 포트 번호에 서버를 엽니다.
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));

// P2P Server를 엽니다.
p2pServer.listen();