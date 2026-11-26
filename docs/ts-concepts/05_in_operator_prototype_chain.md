# `in` 运算符、原型链与 `undefined` 比较

## 问题背景
写括号匹配时，判断一个字符是不是右括号有两种常见写法：

```typescript
const pairs = { ')': '(', ']': '[', '}': '{' } as const

// 写法 A：in 运算符
char in pairs

// 写法 B：取值后和 undefined 比较
pairs[char] !== undefined
```

两者在大多数时候结果相同，但它们**问的根本不是同一个问题**。

## 关键：对象取值会沿原型链查找

JS 里每个普通对象都挂在一条隐形的链上：

```
pairs  →  Object.prototype  →  null
```

`Object.prototype` 上自带一批方法：`toString`、`valueOf`、`constructor`、`hasOwnProperty`、`isPrototypeOf`……

所以 `{}.toString` 不是 `undefined`，而是一个函数——**你没有写过的属性，依然能被取到**。

## 两种写法分别问什么

| 写法 | 真正的问题 | 是否查原型链 |
|---|---|---|
| `key in obj` | 「这个键**存在**吗？」 | 是，会一路向上查 |
| `obj[key] !== undefined` | 「取到的值**不是 undefined**吗？」 | 是（取值本身就会查链） |

注意两边都会查原型链，所以它们的分叉点不是原型链，而是**「键存在，但值是 `undefined`」**：

```typescript
const obj = { a: undefined }

'a' in obj              // true  —— 键确实存在
obj.a !== undefined     // false —— 值就是 undefined
```

这是唯一会给出不同答案的常见场景。

## 那原型链什么时候会咬人？

看这个例子：

```typescript
'toString' in {}                    // true  ❗
Object.hasOwn({}, 'toString')       // false —— 只有自有属性才算
```

`in` 对 `toString` 返回 `true`，因为它把原型链上的方法也当成了「存在的键」。

回到括号匹配：`char` 是**单个字符**，而原型链上的键（`toString`、`valueOf`、`constructor`…）都是多字符单词，永远撞不上。所以这道题里 `in` 是安全的——但这份安全来自于「输入一定是单字符」这个巧合，而非写法本身。

如果哪天把这个 helper 复用去判断整段字符串，`isCloseBracket('toString')` 会返回 `true`，把它误判成右括号。

## 类型层的额外差异

```typescript
const pairs = { ')': '(', ']': '[', '}': '{' } as const
const ch: string = ')'

pairs[ch]              // ❌ TS 报错：string 不能索引这个精确键的对象
ch in pairs            // ✅ 合法，返回 boolean
```

`pairs` 的键是三个精确字面量，用宽泛的 `string` 去索引过不了编译（详见 `02_type_predicate.md`）。所以真正写代码时，**写法 B 在这道题里根本通不过 `npm run typecheck`**，`in` 不只是更安全，也是能编译的那个。

## 推荐写法

```typescript
// 只想判断「自有属性是否存在」，用 hasOwn（ES2022）
function isCloseBracket(char: string): char is CloseBracket {
  return Object.hasOwn(pairs, char)
}
```

`Object.hasOwn` 不查原型链，且能正确处理「值为 `undefined` 的自有属性」，是 `in` 和 `!== undefined` 之间最精确的那个语义。

## 常见误用
1. **以为 `in` 只查自有属性**：它查整条原型链，`'toString' in {}` 是 `true`
2. **用 `obj[key] !== undefined` 判断键存在**：值是 `undefined` 的键会被误判为不存在
3. **以为两种写法等价**：只在「键存在且值非 undefined」时等价，其余情况不等价
4. **以为 `keyof` 能判断键是否存在**：`keyof` 是类型层操作符，编译后完全消失，运行时拿不到它

## 为什么不是 `keyof`

```typescript
const obj = { name: undefined }
type Keys = keyof typeof obj   // 编译期算出的 "name"，运行时不复存在

const key: string = getNameAtRuntime()  // 运行时才知道的键
keyof obj                       // ❌ 语法上就不成立：keyof 只接受类型
```

`keyof` 处理的是**类型**，而「某个运行时字符串是不是某个对象的键」是**值**的问题。类型在编译后会被擦除，无法用来做运行时判断。二者的分工：

| 想做的事 | 时机 | 用什么 |
|---|---|---|
| 把键集合取成一个联合类型 | 编译期 | `keyof typeof obj` |
| 判断运行时字符串是否为键 | 运行时 | `in` / `Object.hasOwn` |

## 关键要点
- `in` 问存在性，`!== undefined` 问取到的值
- 两者都会沿原型链查找；差异集中在「值为 `undefined` 的自有属性」
- `Object.hasOwn(obj, key)` 是「只查自有属性」的标准写法（ES2022）
- 精确键类型的对象不能用 `string` 索引，所以判断存在性只能用 `in` / `hasOwn`，不能用取值比较