# 自动分号插入（ASI）与行首分号

## 问题背景

写堆的下沉逻辑时，这一行前面冒出一个分号：

```typescript
if (val > this.#data[parent]) {
  break
}
;[this.#data[i], this.#data[parent]] = [this.#data[parent], this.#data[i]]
```

看着像多余，其实它防的是一类很隐蔽的解析错误。

## 根源：换行不等于语句结束

JS 里没有一个「行尾自动补分号」的开关，只有 **ASI（Automatic Semicolon Insertion）**：引擎**先尝试**把代码当成合法语法解析，**解析不通**才在换行处补一个分号。

关键就在「先尝试」——如果两行拼起来恰好是合法的，那就**不会**补分号，语义直接改变。

## 危险清单：哪些行首会被「吃掉」

以下 token 出现在行首时，会被引擎理解为**上一行表达式的延续**：

| 行首符号 | 被理解成 | 后果 |
|---|---|---|
| `[` | 索引访问 `prev[...]` | 最经典 |
| `(` | 函数调用 `prev(...)` | 很常见 |
| `` ` `` | 标签模板 ``prev`...` `` | 少见但致命 |
| `+` / `-` | 二元运算 `prev + x` | 两行合成一行计算 |
| `/` | 正则或除法 | 取决于上下文 |

### 例子一：`[` 被当成索引

```javascript
const arr = [1, 2, 3]
[0, 1].forEach(v => console.log(v))
```

引擎读成：

```javascript
const arr = ([1,2,3])[0, 1].forEach(...)
//           3.      ["0,1"] → undefined
//                           ^ 这里才报错
```

报错位置在第三行、信息是 `Cannot read properties of undefined`，**完全指不到真正的原因**。

### 例子二：`(` 被当成调用

```javascript
const result = 42
(function () { console.log('hi') })()
```

读成 `42(function(){...})()` → `TypeError: 42 is not a function`。

## 两种解法

### 解法一：行首补分号

```javascript
const arr = [1, 2, 3]
;[0, 1].forEach(v => console.log(v))
```

这个分号**不属于上一行**，它是「空语句 + 分号」，作用是切断解析。

### 解法二：不写行首 `[` / `(`

```javascript
const tmp = arr[i]
arr[i] = arr[j]
arr[j] = tmp
```

或者用 `const` 承接：

```javascript
const swapped = [arr[j], arr[i]]
arr[i] = swapped[0]
arr[j] = swapped[1]
```

## 本项目里的实际情况

`structures/minHeap.ts` 的两处交换写法：

```typescript
;[this.#data[i], this.#data[parent]] = [this.#data[parent], this.#data[i]]
```

**上一行是 `}`（块结束）**，本来不存在歧义，这个分号属于保险措施：以后若把 `if` 块改成单行 `if (x) break`，保护就自动生效了。

判断标准很简单：**只问「上一行结束时，下一行以 `[`/`(` 开头会不会被吸收」**。上一行是 `}`、`;`、`{`、或者本身就是语句终结点，就不需要；上一行是表达式（赋值、调用、字面量），就必须加。

## Prettier 怎么处理

本项目使用 Prettier 的无分号风格（`semi: false`）。Prettier 不会「删掉」必要分号，而是把它**挪到行首**：

```typescript
// 你写的
const a = foo()
;[1, 2].forEach(...)

// Prettier 保持不动（因为删了会改变语义）
```

所以看到行首孤零零的 `;`，不要手贱删掉——它是 Prettier 认可的语义保护。

## 常见误区

1. **以为「换行就是语句结束」**：JS 不是这样，解析优先级高于换行
2. **以为分号属于上一行**：行首分号是独立的空语句分号
3. **以为 ASI 很智能**：它只做「解析失败后的补救」，不做语义判断
4. **`return` 后换行**：`return` 是 ASI 的特例，会直接补分号，所以 `return\n 值` 会返回 `undefined`

## 关键要点

- ASI = 解析失败才补分号，成功解析时不补
- `[` 和 `(` 开头的行最容易被上一行吸收
- 行首 `;` 是防御手段，不是语法要求
- 能不能省，只看「上一行是不是表达式结尾」
- Prettier 会自动保护，看到行首 `;` 别删