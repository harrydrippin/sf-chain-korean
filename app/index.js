const express = require("express");
const Blockchain = require("../blockchain");

// 이 서버가 어느 포트에 열릴지를 결정합니다.
// 기본적으로 환경 변수를 따라가며, 없을 경우 3001을 기본으로 합니다.
const HTTP_PORT = process.env.HTTP_PORT || 3001;

// Express Application을 선언합니다.
const app = express();
const bc = new Blockchain();

/**
 * Blockchain이 가진 Block들을 반환합니다.
 */
app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

// 주어진 포트 번호에 서버를 엽니다.
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));