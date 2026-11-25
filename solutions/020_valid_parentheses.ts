// 判断一串括号是否合法闭合

const pairs = { ')': '(', ']': '[', '}': '{' } as const
type CloseBracket = keyof typeof pairs
function isCloseBracket(str: string): str is CloseBracket {
  return str in pairs
}

export function getResult(strs: string): boolean {
  // 创建数组模拟栈结构（pop/push）
  const myStack: string[] = []
  // 循环这一串括号
  for (let i = 0; i < strs.length; i++) {
    const str = strs[i]
    // 判断是否是右括号，是右括号判断栈顶是否是对应的左括号，不是则直接入栈顶
    if (isCloseBracket(str)) {
      const expected = pairs[str] // expected 是期望的左括号
      if (myStack.pop() !== expected) {
        return false
      }
    } else {
      myStack.push(str)
    }
  }
  return myStack.length === 0
}
