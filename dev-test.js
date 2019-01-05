// Block 클래스를 불러옵니다.
const Block = require('./block');

// mineBlock 함수가 잘 동작하는지 확인합니다.
// Genesis Block 바로 뒤에 붙는 Block을 만든다고 가정합니다.
const fooBlock = Block.mineBlock(
  Block.genesis(),
  "foo"
);

console.log(fooBlock.toString());