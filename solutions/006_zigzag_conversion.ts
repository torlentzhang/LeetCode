// 6. Zigzag Conversion
// 将一个给定字符串 s 根据给定的行数 numRows ，以从上往下、从左到右进行 Z 字形排列。

function convert(s: string, numRows: number): string {
  if (numRows === 1) {
    return s
  }
  const stringArray = new Array(numRows).fill('')
  let step = 1
  let row = 0
  let result = ''
  for (let i = 0; i < s.length; i++) {
    stringArray[row] += s[i]
    if (row === 0) {
      step = 1
    } else if (row === numRows - 1) {
      step = -1
    }
    row += step
  }
  stringArray.forEach((item) => {
    result += item
  })
  return result
}
const s = 'PAYPALISHIRING'
console.log(convert(s, 3))
