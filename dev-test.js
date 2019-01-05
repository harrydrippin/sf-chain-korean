// Block 클래스를 불러옵니다.
const Block = require('./block');

// 인스턴스를 생성합니다.
const block = new Block(
  // Timestamp
  "foo",
  // lastHash
  "bar",
  // hash
  "zoo",
  // data
  "baz"
);

// 위에서 만든 Block을 설명하는 String을 출력해봅니다.
console.log(block.toString());
// Genesis Block을 설명하는 String을 출력해봅니다.
console.log(Block.genesis().toString());