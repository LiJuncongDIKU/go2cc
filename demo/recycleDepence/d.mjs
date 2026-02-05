import { done as cDone } from './c.mjs';
export let done = false;
console.log('在 d 中，cDone =', cDone);
done = true;
console.log('d 执行完毕');
