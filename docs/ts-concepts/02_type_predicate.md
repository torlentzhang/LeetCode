# 类型谓词与 `as const`（Type Predicate）

## 问题背景
写括号匹配时，这段代码一开始是通不过编译的：

```typescript
const pairs = { ")": "(", "]": "[", "}": "{" };
const ch: string = ")";
pairs[ch];  // ❌ TS 报错：没有索引签名
```

原因：`pairs` 被推断成 `{ ")": string; "]": string; "}": string }`，键是**三个精确字面量**，而 `ch` 是宽泛的 `string`，TS 无法保证 `ch` 一定是其中之一。

## 第一步：`as const` —— 让键保留字面量类型
```typescript
const pairs = { ")": "(", "]": "[", "}": "{" } as const;
// 类型：{ readonly ")": "("; readonly "]": "["; readonly "}": "{" }
```
`as const` 做两件事：**值类型变字面量**（`string` → `")"`）、**属性变只读**。对映射表来说，这正是我们要的：键集合被精确记录下来。

## 第二步：`keyof typeof` —— 取出键的联合类型
```typescript
type CloseBracket = keyof typeof pairs;  // ")" | "]" | "}"
```
两个关键字分别在不同位置的含义：

| 写法 | 位置 | 含义 |
|---|---|---|
| `typeof pairs` | **类型**位置 | 取出变量 `pairs` 的类型（不是运行时的 `typeof` 运算符） |
| `keyof T` | 类型位置 | 取出 `T` 所有键组成的联合类型 |

## 第三步：类型谓词 `str is CloseBracket`
```typescript
function isCloseBracket(str: string): str is CloseBracket {
  return str in pairs;
}
```

这行代码要分成两个世界来读：

**运行时（JS 真正执行的）**
- 函数体只有一句 `str in pairs`，就是普通的 `in` 运算符：判断 `str` 是不是对象的键
- 返回 **boolean**：`isCloseBracket(")")` → `true`，`isCloseBracket("(")` → `false`
- **不做任何值转换**。它不会返回 `"("`，映射由 `pairs[str]` 单独完成
- `str is CloseBracket` 这部分在运行时**完全不存在**，编译后就被擦除了

**类型层（只给 TS 编译器看）**
- 返回值类型写 `str is CloseBracket` 而不是 `boolean`，意思是：
  “**只要这个函数返回 true，就把传入的 `str` 收窄为 `CloseBracket`**”
- 于是调用方在 `if (isCloseBracket(ch))` 分支里，`pairs[ch]` 就合法了，因为此时 `ch` 的类型已经是 `")" | "]" | "}"`

## 收窄（Narrowing）效果对照
```typescript
const ch: string = ")";

pairs[ch];                 // ❌ 报错：string 不能索引这个对象

if (isCloseBracket(ch)) {
  pairs[ch];               // ✅ 通过：ch 被收窄为 ")" | "]" | "}"
}

if (ch in pairs) {
  pairs[ch];               // ❌ 仍然报错：in 运算符不会收窄非字面量变量
}
```

`ch in pairs` 只能判断，**不能收窄**——这正是需要包一层类型谓词的原因。

## 常见误用
1. **以为它返回映射后的值**：`isCloseBracket` 只回答“是不是右括号”，问“对应的左括号是谁”要用 `pairs[ch]`
2. **以为 `str is X` 有运行时作用**：它纯粹是类型标注，删掉也不影响执行结果
3. **在谓词里撒谎**：如果函数返回 `true` 时 `str` 并不是 `CloseBracket`，类型系统不会报错，但运行时会出现“类型说安全、实际是 undefined”的裂缝

## 关键要点
- `as const` 保留字面量类型 + 只读；映射表用它才能精确记录键集合
- `keyof typeof obj` 是“对象键的联合类型”的标准写法（`typeof` 在类型位置取值类型）
- `x is T` 是**类型谓词**：运行时只是一个 boolean 函数，类型层负责收窄
- 判断和取值是两件事：谓词负责“是不是”，`obj[key]` 负责“是什么”
