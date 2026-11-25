# 栈与括号匹配模式 (Stack / LIFO)

## 核心思想
**栈**只允许在一端进出，后进先出（LIFO, Last In First Out）。它擅长的场景是：**处理“最近打开的东西必须最先被处理”的结构**。

判断括号是否合法闭合，规则可以精确成两条：

1. 每遇到一个右括号，必须和**最近一个尚未闭合的左括号**同类型
2. 扫完整串后，**栈必须为空**（不能还有没闭合的左括号）

“最近一个”就是 LIFO 的信号。

## 适用场景（题目关键词）
1. **括号 / 标签匹配**：合法括号、HTML 标签闭合、编译器的语法检查
2. **嵌套结构**：嵌套数组展开、嵌套函数调用
3. **表达式求值 / 后缀表达式**（逆波兰表达式）
4. **单调栈**：下一个更大元素、柱状图中最大矩形、每日温度
5. **撤销 / 回退**：编辑器 undo、浏览历史、DFS 的显式栈实现

## 模板代码
```typescript
const pairs = { ")": "(", "]": "[", "}": "{" } as const;
type CloseBracket = keyof typeof pairs;

function isCloseBracket(ch: string): ch is CloseBracket {
  return ch in pairs;   // 运行时返回 boolean；`ch is` 只是给 TS 收窄类型
}

function isValid(s: string): boolean {
  const stack: string[] = [];

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (isCloseBracket(ch)) {
      // 右括号：栈顶必须是它的搭档
      const expected = pairs[ch];
      if (stack.pop() !== expected) return false;  // 空栈时 pop 返回 undefined，天然不相等
    } else {
      stack.push(ch);                              // 左括号：入栈等待闭合
    }
  }

  return stack.length === 0;   // 别忘了收尾检查：还有没闭合的左括号
}
```

## 示例：模拟执行
```
输入 "([)]"
(  栈: [ ( ]
[  栈: [ ( [ ]
)  栈顶是 [ ，但 ) 期望 (  →  false
```

```
输入 "(((("
( ( ( ( 全部入栈，栈: [ ( ( ( ( ]
循环结束，栈不为空  →  false
```

## 易错点
- **最后必须检查栈是否为空**：`"(((("` 循环里一次都不会 `return false`，漏掉收尾检查就会误判为合法
- **判空时 `pop()` 返回 `undefined`，不报错**：`undefined !== expected` 恰好得到 `false`，虽能工作，但更显式的写法是先判断 `stack.length === 0`
- **不要用“栈里有没有”代替“栈顶是不是”**：`([)]` 中栈里确实“有” `(`，但它不是最近打开的，必须用栈顶比较
- **映射方向要统一**：写 `右 → 左`，遇到右括号一次查表就能拿到期望值；写成 `左 → 右` 则要在右括号时反向查找
- 数组没有 `peek`，看栈顶用 `stack[stack.length - 1]`

## 关键要点
- 栈解决的是“**最近优先**”的问题，看到“嵌套 / 最近 / 匹配”就想到它
- 括号题的三个动作：左括号入栈、右括号比对栈顶、收尾判空
- 用 `as const` + 类型谓词，可以让“查表”这一步在 TS 里完全类型安全
