// Promise构造方法内是同步代码
new Promise((resolve, reject) => {
  console.log('Promise 1'); // 第 1 输出
  resolve();
}).then(() => {
  setTimeout(() => {
    new Promise((resolve, reject) => {
      console.log('Promise 4'); // 第 3 输出
      resolve();
    }).then(() => {
      console.log('Promise 5'); // 第 5 输出
    });
    console.log('Promise 2'); // 第 4 输出
  }, 0);
  console.log('Promise 3'); // 第 2 输出
});