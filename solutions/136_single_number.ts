// 给一个数组，里面只有一个数字出现一次，其余都出现两次，找出那个只出现一次的
// 空间复杂度o1

export function getOneCountNum(array: number[]) {
  let result = 0
  for (let i = 0; i < array.length; i++) {
    result = result ^ array[i]
  }
  return result
}
