const moduleB = require('./countB.cjs');
const countModule = require('./count.cjs');

console.log(moduleB.getCount()); // 0
moduleB.raise();
console.log(moduleB.getCount()); // 1

console.log(moduleB.count); // 0
moduleB.count++;
console.log(moduleB.count); // 1

console.log(countModule.count); // 0
console.log(countModule.getCount()); // 1
countModule.raise();
console.log(countModule.count); // 0
console.log(countModule.getCount()); // 2
