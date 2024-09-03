class myPromise {
  constructor(executer) {
    this.state = "pending"
    this.value = undefined
    this.reason = undefined
    this.onFulFilledCallbacks = []
    this.onRejectFilledCallbacks = []
    const resolve = val => {
      if (this.state === "pending") {
        this.state = "fulfilled"
        this.value = val
        this.onFulFilledCallbacks.forEach(callback => {
          callback(val)
        })
      }
    }
    const reject = val => {
      if (this.state === "pending") {
        this.state = "rejected"
        this.reason = val
        this.onRejectFilledCallbacks.forEach(callback => {
          callback(val)
        })
      }
    }
    try {
      executer(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  then(onFulFilled, onRejectFilled) {
    onFulFilled =
      typeof onFulFilled === "function" ? onFulFilled : value => value
    onRejectFilled =
      typeof onRejectFilled === "function"
        ? onRejectFilled
        : reason => {
            throw reason
          }

    let promise = new myPromise((resolve, reject) => {
      if (this.state === "fulfilled") {
        setTimeout(() => {
          try {
            let x = onFulFilled(this.value)
            resolve(x)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.state === "rejected") {
        setTimeout(() => {
          try {
            let y = onRejectFilled(this.reason)
            resolve(y)
          } catch (error) {
            reject(error)
          }
        })
      } else {
        this.onFulFilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulFilled(this.value)
              resolve(x)
            } catch (error) {
              reject(error)
            }
          })
        })
        this.onRejectFilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let y = onRejectFilled(this.reason)
              reject(y)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    })
    return promise
  }
  catch(onRejected) {
    return this.then(null, onRejected)
  }
  finally(onFinally) {
    return this.then(
      value => resolve(onFinally()).then(() => value),
      reason =>
        reject(onFinally()).then(() => {
          throw reason
        })
    )
  }

  static resolve(value) {
    return new myPromise(resolve => {
      resolve(value)
    })
  }
  static reject(reason) {
    return new myPromise((resolve, reject) => {
      reject(reason)
    })
  }
  // Promise.all() 静态方法接受一个 Promise 可迭代对象作为输入，
  // 并返回一个 Promise。当所有输入的 Promise 都被兑现时，
  // 返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），
  // 并返回一个包含所有兑现值的数组。如果输入的任何 Promise 被拒绝，
  // 则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因。
  static all(promises) {
    return new myPromise((resolve, reject) => {
      const result = []
      promises.forEach(promise => {
        promise
          .then(value => {
            result.push(value)
            if (result.length === promises.length) {
              resolve(result)
            }
          })
          .catch(reject)
      })
    })
  }
  //  Promise.race() 静态方法接受一个 promise 可迭代对象作为输入，并返回一个 Promise。
  //  这个返回的 promise 会随着第一个 promise 的敲定而敲定。
  static race(promises) {
    return new myPromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve).catch(reject)
      })
    })
  }
  //  Promise.any() 静态方法将一个 Promise 可迭代对象作为输入，并返回一个 Promise。
  //  当输入的任何一个 Promise 兑现时，这个返回的 Promise 将会兑现，并返回第一个兑现的值。
  //  当所有输入 Promise 都被拒绝（包括传递了空的可迭代对象）时，它会以一个包含拒绝原因数组的 AggregateError 拒绝。
  static any(promises) {
    return new myPromise((resolve, reject) => {
      const result = []
      promises.forEach(promise => {
        promise
          .then(value => {
            resolve(value)
          })
          .catch(reason => {
            result.push(reason)
            if (result.length === promise.length) {
              reject(new AggregateError("All promises were rejected"))
            }
          })
      })
    })
  }
  //  Promise.allSettled() 静态方法将一个 Promise 可迭代对象作为输入，
  //  并返回一个单独的 Promise。当所有输入的 Promise 都已敲定时（包括传入空的可迭代对象时），
  //  返回的 Promise 将被兑现，并带有描述每个 Promise 结果的对象数组。
  static allSettled(promises) {
    return new myPromise((resolve, reject) => {
      const result = []
      promises.forEach(promise => {
        promise
          .then(value => {
            result.push({
              status: "fulfilled",
              value,
            })
            if (result.length === promises.length) {
              resolve(result)
            }
          })
          .catch(reason => {
            result.push({
              status: "rejected",
              reason,
            })
            if (result.length === promises.length) {
              reject(result)
            }
          })
      })
    })
  }
}

// test
const p1 = new myPromise((resolve, reject) => {
  setTimeout(() => resolve("p1 resolved"), 1000)
})

const p2 = new myPromise((resolve, reject) => {
  setTimeout(() => reject("p2 rejected"), 1500)
})

const p3 = new myPromise((resolve, reject) => {
  setTimeout(() => resolve("p3 resolved"), 2000)
})

myPromise
  .all([p1, p2, p3])
  .then(results => {
    console.log("All resolved:", results)
  })
  .catch(error => {
    console.error("All error:", error)
  })

myPromise.race([p1, p2, p3]).then(result => {
  console.log("Race winner:", result)
})

myPromise.allSettled([p1, p2, p3]).then(results => {
  console.log("All settled:", results)
})

myPromise
  .any([p1, p2, p3])
  .then(result => {
    console.log("Any resolved:", result)
  })
  .catch(error => {
    console.error("Any error:", error)
  })

p1.then(result => {
  console.log(result)
  return "then result"
})
  .catch(error => {
    console.error(error)
  })
  .finally(() => {
    console.log("Finally for p1")
  })
