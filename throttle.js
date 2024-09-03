// 节流，连续触发函数，每周期内只触发一次
// 每次执行时记录时间，下个周期时再执行一次
function throttle(callback, time) {
  let preTime = Date.now()
  return function () {
    let _this = this
    const curTime = Date.now()
    if (curTime - preTime >= time) {
      preTime = curTime
      callback.call(_this, ...arguments)
    }
  }
}

// 执行函数体
const callback = (...args) => {
  console.log(...args)
}

const fn = throttle(callback, 1000)

// 多次触发函数
let interVal = setInterval(() => {
  fn(1, 2, 3, 4)
}, 100)

// 停止触发
setTimeout(() => {
  clearInterval(interVal)
}, 3000)
