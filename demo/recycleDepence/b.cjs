exports.done = false;
const a = require('./a.cjs'); // 此时 a 只运行了一半！
console.log('在 b 中，a.done =', a.done);
exports.done = true;
console.log('b 执行完毕');