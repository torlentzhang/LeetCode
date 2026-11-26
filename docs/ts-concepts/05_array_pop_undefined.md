# 空数组 pop() 返回 undefined

## 问题背景

复习「20. 有效的括号」时，这段代码没有显式判断栈空：

```typescript
if (isCloseBracket(curBracket)) {
  const expected = pairsMap[curBracket]
  if (bracketsStack.pop() !== expected) {
    return false
  }
}
```

输入是 `")"` 时栈是空的，`pop()` 会返回什么？为什么这段代码仍然判对？

## 根源：JS 的数组越界是「静默」的

```javascript
[].pop() // undefined
[].shift() // undefined
[1, 2, 3][99] // undefined
```

JS 不检查越界，取不到就给你 `undefined`，不抛异常。

TS 把这件事写进了类型签名：`string[]` 的 `pop()` 是 `pop(): string | undefined`。所以 `pop()` 的结果永远要按「可能取不到」处理。

## 为什么代码「恰好」是对的

```typescript
undefined !== '(' // true
```

`undefined` 不等于任何左括号，所以「栈空时遇到右括号」也返回 `false` —— 结果正确，但正确性来自语言行为的巧合，而不是代码显式表达了「栈空即非法」这条规则。

## 风险：换个环境就崩

| 语言 / 结构 | 空栈 pop 的行为 |
|---|---|
| JavaScript 数组 | 返回 `undefined` |
| Python `list.pop()` | 抛 `IndexError` |
| Java `Deque.pop()` | 抛 `NoSuchElementException` |
| C++ `vector::pop_back()` | 未定义行为 |

一旦栈换成自定义结构、或方法从 `pop()` 换成别的语义，这个隐式保证就消失了。

## 显式写法

```typescript
if (bracketsStack.length === 0) return false
if (bracketsStack.pop() !== expected) return false
```

或者先接住返回值再判断：

```typescript
const top = bracketsStack.pop()
if (top === undefined || top !== expected) return false
```

两种写法都把「栈空」变成读代码时可见的规则，而不是需要读者去查 `[].pop()` 手册才知道的事。

## 同类信号：哪些地方也会静默返回 undefined

- `arr[i]`、`arr.at(-1)`：越界返回 `undefined`
- `Map.prototype.get()`：key 不存在返回 `undefined`
- `Array.prototype.find()`：找不到返回 `undefined`
- `JSON.parse()`、`fetch()`：这类会抛错 / reject 的边界反而安全，因为它们不会静默

共同点：**用返回值做判断或取值之前，先问一句「取不到时应该怎样」**。

## 常见误区

1. 以为 `pop()` 空数组会报错（Python 思维迁移）
2. 以为 `undefined !== expected` 是业务判断，实际是靠类型宽容兜住了逻辑
3. 看到 TS 报 `string | undefined` 就急着 `!` 断言，而不是想清楚空的情况该怎么处理

## 关键要点

- `[].pop()` → `undefined`，不抛错，`shift()` 同理
- `pop(): T | undefined` 是 TS 给你的提示，不是噪音
- 隐式依赖能跑对，但换语言、换结构就失效
- 栈题里「栈空时遇到右括号」是一条独立规则，值得显式写出来