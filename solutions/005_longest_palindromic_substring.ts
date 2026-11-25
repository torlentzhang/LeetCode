// 5. Longest Palindromic Substring
// 给你一个字符串 s，找到 s 中最长的回文子串。

function longestPalindrome(s: string): string {
  if (s.length < 2) {
    return s
  }
  let start = 0
  let maxLength = 0
  function expandAroundCenter(s: string, left: number, right: number): number {
    while (left >= 0 && right < s.length) {
      if (s[left] === s[right]) {
        left--
        right++
      } else {
        break
      }
    }
    // 左边界 left + 1,右边界 right - 1
    return Math.max(right - left - 1)
  }
  for (let i = 0; i < s.length; i++) {
    const length1 = expandAroundCenter(s, i, i)
    const leghth2 = expandAroundCenter(s, i, i + 1)
    const len = Math.max(length1, leghth2)

    if (len > maxLength) {
      start = i - Math.floor((len - 1) / 2)
      maxLength = len
    }
  }
  return s.substring(start, start + maxLength)
}

const myString = 'cbaba'
console.log(longestPalindrome(myString))
