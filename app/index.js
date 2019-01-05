const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain");
const P2pServer = require("./p2p-server");

// 이 서버가 어느 포트에 열릴지를 결정합니다.
// 기본적으로 환경 변수를 따라가며, 없을 경우 3001을 기본으로 합니다.
const HTTP_PORT = process.env.HTTP_PORT || 3001;

// Express Application과 P2P Server를 선언합니다.
const app = express();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

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

  // GET blocks로 리디렉션합니다.
  res.redirect("/blocks");
});

// 주어진 포트 번호에 서버를 엽니다.
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));

// P2P Server를 엽니다.
p2pServer.listen();