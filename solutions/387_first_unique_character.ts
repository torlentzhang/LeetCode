// 给一个字符串，找出第一个只出现一次的字符对应的下标

function getChar(chars: string) {
  // 创建map存储字符和下标
  const charMap = new Map()
  // 遍历字符串，重复记为-1
  for (let i = 0; i < chars.length; i++) {
    const charKey = chars[i]
    if (charMap.has(charKey)) {
      charMap.set(charKey, -1)
    } else {
      charMap.set(charKey, i)
    }
  }
  for (let i = 0; i < chars.length; i++) {
    if (charMap.get(chars[i]) === i) {
      return i
    }
  }
  return -1
}

const testChars = 'abdabcd'
const result = getChar(testChars)
console.log(result)
