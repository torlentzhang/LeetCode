// 3. longest_substring.ts

// 给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串 的长度。

export function lengthOfLongestSubstring(s: string): number {
  let left = 0
  let right = 0
  let maxLength = 0
  const windowMap = new Map<string, number>()
  while (right < s.length) {
    if (windowMap.has(s[right])) {
      left = Math.max(windowMap.get(s[right])! + 1, left)
    }
    windowMap.set(s[right], right)
    right++
    maxLength = Math.max(maxLength, right - left)
  }
  return maxLength
}
