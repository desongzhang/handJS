function debounce(callback, wait) {
  let time
  return function () {
    clearTimeout(time)
    let _this = this
    time = setTimeout(() => {
      callback.call(_this, ...arguments)
    }, wait)
  }
}

// 执行函数体
const callback = (...args) => {
  console.log(...args)
  console.log("防抖，停止操作后执行一次")
}

const fn = debounce(callback, 500)

// 多次触发函数
let interVal = setInterval(() => {
  fn(1, 2, 3, 4)
}, 100)

// 停止触发
setTimeout(() => {
  clearInterval(interVal)
}, 1000)
