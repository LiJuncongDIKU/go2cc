import { done as dDone } from './d.mjs';
export let done = false;
console.log('在 c 中，dDone =', dDone);
done = true
console.log('c 执行完毕');
