const Blockchain = require("./blockchain");

const bc = new Blockchain();

// 10개의 Block을 Blockchain에 넣습니다.
for (let i = 0; i < 10; i++) {
  console.log(bc.addBlock(`foo ${i}`).toString());
}