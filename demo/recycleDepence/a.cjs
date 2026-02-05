exports.done = false;
const b = require('./b.cjs');
console.log('在 a 中，b.done =', b.done);
exports.done = true;
console.log('a 执行完毕');