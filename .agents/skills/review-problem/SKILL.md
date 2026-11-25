---
name: review-problem
description: 当用户想复习/重做一道已经做过的 LeetCode 题目时使用。自动从 solutions/ 提取题目描述和函数签名，生成一个"只有题目、无解答"的练习文件放在 solutions/review/ 下；做完后先验证解法正确性，通过后再删除练习文件。
---
# 复习已做过的题目

本 skill 用于快速复习用户已经解过的 LeetCode 题。核心思路：从已有的解题文件中提取"题目部分"（注释描述 + 空函数签名），生成一个不含解答的练习文件，让用户重新独立作答，确认做对后自动清理。

## 行为一：创建练习文件

1. **定位题目**：根据用户给出的编号（如 `1`、`001`）或名字（如 `two sum`、`两数之和`），在 `solutions/` 目录下找到对应的已解文件（命名形如 `001_two_sum.ts`）。匹配方式：按文件名数字前缀或 snake_case 名字关键词模糊匹配。

   - 如果在 `solutions/` 里找不到对应文件，告诉用户：本 skill 仅服务于复习"已做过的题"，全新题目请走标准学习流程，不要凭空捏造题目内容。
2. **读取并提取"只有题目"的内容**：读取该解文件，按下述规则提取：

   - **保留**：文件顶部的所有注释行（`//` 开头），即题目标题 + 中文描述。
   - **保留**：第一个 `function` 声明的**签名行**（函数名、参数、返回类型），但把函数体替换为 `throw new Error('TODO: 实现 <函数名>')`。不要留空函数体——`strict` 模式下声明了返回类型却不返回值，会让 `npm run typecheck` 直接报错；抛错既满足类型检查，又让测试失败信息直指「还没实现」。
   - **改名**：将函数名改为 `practice<原函数名>`（首字母保持小写/原大写不变），避免与原解文件中的函数同名冲突。
   - **导出**：在函数名前加上 `export` 关键字，方便测试文件导入。
   - **删除**：函数体内的所有实现代码。
   - **删除**：其余的 helper 函数、嵌套函数、`console.log` 测试代码、以及函数下方的任何内容。
3. **生成练习文件**：

   - 目录：`solutions/review/`（若不存在则创建）
   - 文件名：与原解文件同名（如 `001_two_sum.ts`）
   - 内容：上面提取出的"题目注释 + 改名并导出后的空签名"。
4. **生成测试文件**：

   - 目录：与练习文件相同（`solutions/review/`）
   - 文件名：`<原文件名去扩展名>.test.ts`
   - 内容：按 `test-conventions` skill 编写，导入练习文件中的 `practice<原函数名>`
   - 用例数量 4-6 个，优先用题目描述中的官方示例，再补充边界/特殊/错误输入。
   - **用例来源优先级**：若 `solutions/<原文件名>.test.ts` 已存在，先读取它，把其中的用例表原样搬过来，保证正式题解和复习练习用同一套判据；不存在时再根据题面示例自行构造。
   - 运行方式：`npm test -- solutions/review/<文件名>.test.ts`，或整个目录 `npm test -- solutions/review`。
5. 创建后，告诉用户两个文件的路径和运行命令 `npm test -- solutions/review`，并提醒："完成后你可以先自己运行测试验证，也可以直接对我说『完成』，我会检查你的代码并帮你清理文件。"

### 提取示例

原解文件 `005_longest_palindromic_substring.ts`：

```ts
// 5. Longest Palindromic Substring
// 给你一个字符串 s，找到 s 中最长的回文子串。

function longestPalindrome(s: string): string {
  if (s.length < 2) { return s }
  let start = 0
  function expandAroundCenter(s: string, left: number, right: number): number { ... }
  ...
}

const myString = 'cbaba'
console.log(longestPalindrome(myString))
```

生成的练习文件 `solutions/review/005_longest_palindromic_substring.ts`：

```ts
// 5. Longest Palindromic Substring
// 给你一个字符串 s，找到 s 中最长的回文子串。

export function practiceLongestPalindrome(s: string): string {
  throw new Error('TODO: 实现 practiceLongestPalindrome')
}
```

## 行为二：验证与清理

当用户说"完成"/"done"/"做完了"等时，不要立即删除练习文件，而是先验证：

1. **读取两份文件**：原解文件 `solutions/<file>` 与练习文件 `solutions/review/<file>`。
2. **检查是否为空壳**：如果练习文件里的函数体仍然是 `throw new Error('TODO: ...')` 或为空，提示用户先完成代码。
3. **运行测试**：执行 `npm test -- solutions/review`，按输出区分两类失败：
   - 报 "No test files found" 或语法/导入错误 → 测试文件自身有问题，先修文件；
   - 用例断言失败 → 解法有问题，进入下一步引导。
     测试全绿只证明「通过了已知用例」，不证明解法普适，所以不能只凭绿勾就收工。
4. **静态分析正确性**：
   - 比较用户写的新解法与原解的逻辑差异，判断逻辑是否等价且正确。
   - 检查是否覆盖了题目描述的约束与边界条件。
   - 发现错误时，先从算法逻辑/数据结构概念层面解释 Bug 成因，再指出具体代码行，然后让用户修改并重新说"完成"。
5. **通过后清理**：确认解法正确后，祝贺用户然后询问是否删除练习文件 **和** 对应的测试文件。

### 跨会话清理

当用户说"清理练习文件"/"清理 review 目录"，列出 `solutions/review/` 下所有文件并删除它们（删除前确认一下）。

## 注意事项

- 练习文件一律放在 `solutions/review/`，方便集中管理。
- 不要改动原解文件——只读取它来提取题目与验证参考。
- 如果一道题有多个 `function`（如主函数 + helper），只保留主函数（通常是文件里第一个、且名字与文件名含义对应的那个）的改名后空签名，其余一律删除。
- 提取时保留原注释的中文描述原样，不要改写题目内容。
