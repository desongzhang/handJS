// 函数柯里化
// 柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，
// 并且返回接受余下的参数且返回结果的新函数的技术
function sum(a, b, c, d, e) {
  return a + b + c + d + e
}
function curry(fn, ...args1) {
  return function (...args2) {
    const params = args1 || []
    const newArgs = args2.concat(params)
    if (fn.length > newArgs.length) {
      return curry.call(this, fn, ...newArgs)
    } else {
      return fn.call(this, ...newArgs)
    }
  }
}

const myCurry = curry(sum)
console.log(myCurry(1)(2, 3)(4, 5))
console.log(myCurry(1, 2, 3)(4, 5))
