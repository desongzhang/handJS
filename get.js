// 实现lodash中的_get方法

// // input
// const obj = { 选择器: { to: { toutiao: "FE Coder"} }, target: [1, 2, { name: 'byted'}]};
// get(obj, '选择器.to.toutiao', 'target[0]', 'target[2].name');

// // output
// ['FE coder', 1, 'byted']
const obj = {
  选择器: { to: { toutiao: "FE Coder" } },
  target: [1, 2, { name: "byted" }],
}
_get(obj, "选择器.to.toutiao", "target[0]", "target[2].name")
function _get(obj, ...args) {
  const result = []
  args.forEach(path => {
    const array = path.replace(/\[/g, ".").replace(/\]/g, "").split(".")
    const res = array.reduce((pre, cur) => {
      return pre[cur]
    }, obj)
    result.push(res)
  })
  console.log(result)
  return result
}
