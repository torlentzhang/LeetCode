// 20. 有效的括号
//
// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。
//
// 有效字符串需满足：
// 1. 左括号必须用相同类型的右括号闭合。
// 2. 左括号必须以正确的顺序闭合。
// 3. 每个右括号都有一个对应的相同类型的左括号。
//
// 示例 1：输入 s = "()"，输出 true
// 示例 2：输入 s = "()[]{}"，输出 true
// 示例 3：输入 s = "(]"，输出 false
// 示例 4：输入 s = "([])"，输出 true
//
// 提示：
// - 1 <= s.length <= 10^4
// - s 仅由括号 '()[]{}' 组成

const pairs = { ')': '(', ']': '[', '}': '{' } as const
type CloseBracket = keyof typeof pairs
function isCloseBracket(str: string): str is CloseBracket {
  return str in pairs
}

export function isValid(s: string): boolean {
  const bracketsStack: string[] = []
  for (let i = 0; i < s.length; i++) {
    const curBracket = s[i]
    if (isCloseBracket(curBracket)) {
      const expected = pairs[curBracket]
      if (bracketsStack.length === 0) {
        return false
      }
      if (bracketsStack.pop() !== expected) {
        return false
      }
    } else {
      bracketsStack.push(curBracket)
    }
  }
  return bracketsStack.length === 0
}
