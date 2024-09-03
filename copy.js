// 浅拷贝
// ‌浅拷贝（Shallow Copy）是一种对象或数据的复制方式，它复制对象的引用而不是对象本身。
// 这意味着，如果对象包含基本数据类型（如整数、浮点数等），浅拷贝会复制这些值；
// 但如果对象包含引用类型（如数组、对象等），浅拷贝只会复制引用，而不是引用指向的对象。
// 因此，浅拷贝的新对象和原始对象共享相同的引用对象，修改其中一个对象的引用字段会影响到另一个对象。

// 浅拷贝的特点：
// ‌复制基本数据类型‌：浅拷贝会复制基本数据类型的值。
// ‌复制引用类型‌：对于引用类型，浅拷贝只复制引用，而不是引用指向的对象。
// ‌共享内存‌：浅拷贝的新对象和原始对象共享相同的内存地址，因此修改其中一个对象会影响另一个对象。
// 浅拷贝的实现方法：
// ‌扩展运算符（Spread Operator）‌：使用扩展运算符可以创建一个对象或数组的浅拷贝副本。
// 例如：const shallowCopyObj = { ...originalObj };
// ‌Object.assign()方法‌：Object.assign()方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
// 例如：const shallowCopyObj = Object.assign({}, originalObj);
// 浅拷贝与深拷贝的区别：
// ‌深拷贝‌：深拷贝会递归复制对象及其所有嵌套的对象，确保新对象与原始对象完全独立，修改新对象不会影响原始对象。
// ‌浅拷贝‌：浅拷贝只复制对象的顶层结构，对于嵌套的对象或数据，浅拷贝不会进行递归复制，因此新对象和原始对象在引用类型上共享内存。
// 选择使用浅拷贝还是深拷贝取决于具体的需求。如果需要对对象进行修改而不影响原始对象，或者处理嵌套的对象结构，那么深拷贝是更合适的选择。
// 而对于简单的数据结构或者只需要引用原始对象的情况，浅拷贝可能更加高效和节省内存
const shallowCopy = obj => {
  if (Array.isArray(obj)) {
    return [...obj]
  } else if (typeof obj === "object" && obj !== null) {
    return Object.assign({}, obj)
  }
  return obj
}

const deepCopy = obj => {
  if (Array.isArray(obj)) {
    const res = []
    obj.forEach(item => {
      res.push(deepCopy(item))
    })
  } else if (typeof obj === "object" && obj !== null) {
    const res = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        res[key] = deepCopy(obj[key])
      }
    }
    return res
  }
  return obj
}

const obj = {
  name: "123",
  message: {
    year: "24",
  },
}
const obj1 = shallowCopy(obj)
const obj2 = deepCopy(obj)

obj.name = "1234"
obj.message.year = "25"
// console.log(obj, obj1)
console.log(obj, obj2)
