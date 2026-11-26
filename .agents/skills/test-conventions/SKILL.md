---
name: test-conventions
description: 写、改、审、教测试时使用。测试通过 public interface 验证 behavior，而不是 implementation details。用户要自己写测试，不代写。
---
# 测试约定

测试通过 public interface 验证 behavior，而不是 implementation details。代码可以整个重写，测试不该跟着改。好测试读起来像一份规格说明："用户可以用有效购物车结账"精确告诉你存在什么能力，而且它不关心内部结构，所以内部重构之后照样通过。

一条测试的特征：

- 测调用方关心的 behavior
- 只用 public API
- 内部重构后仍然通过
- 描述 WHAT，不是 HOW
- 一条测试一个逻辑断言

## Seam：测试写在哪里

seam 是你要测的 public boundary：你在那里观察 behavior，而不伸手进去。测试只写在 seam 上，不针对内部实现。

只测事先约定好的 seam。写任何测试之前，先写下这次要测的 seam，并跟用户确认；没有确认过的不写。你不可能测完所有东西，所以事先约定 seam，才能把精力放在关键路径和复杂逻辑上，而不是每一个边界情况。

问一句："public interface 是什么，哪些 seam 该测？"每个 seam 用一句话说明它能抓到什么、会漏掉什么。

## 反模式

**Implementation-coupled（绑实现）**：mock 内部协作者、测私有方法，或者绕过 interface 从侧面验证（比如直接查数据库而不是用 interface）。识别信号：你重构了、但 behavior 没变，测试却红了。

红旗：

- mock 内部协作者
- 测私有方法
- 断言调用次数或调用顺序
- 重构时测试变红，而 behavior 没变
- 测试名描述 HOW 而不是 WHAT
- 绕过 interface，从外部手段验证

```ts
// BAD: 绕过 interface 去验证
await createUser({ name: 'Alice' })
const row = await db.query('SELECT * FROM users WHERE name = ?', ['Alice'])
expect(row).toBeDefined()

// GOOD: 通过 interface 验证
const user = await createUser({ name: 'Alice' })
const retrieved = await getUser(user.id)
expect(retrieved.name).toBe('Alice')
```

**Tautological（同义反复）**：断言用代码的同一种算法把期望值又算了一遍（`expect(add(a, b)).toBe(a + b)`、手写一份与实现同构的快照、把常量断言成它自己），所以它由构造必然通过，永远不可能与代码不一致。期望值必须来自独立的事实源：一个已知正确的字面量、一个手算过的例子、规格说明。

```ts
// BAD: 期望值用同样的 reduce 算出来
const expected = items.reduce((sum, i) => sum + i.price, 0)
expect(calculateTotal(items)).toBe(expected)

// GOOD: 期望值来自独立的已知字面量
expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15)
```

**Horizontal slicing（横切）**：先把所有测试写完，再写所有实现。批量写出的测试验证的是"想象出来的"behavior：你测的是东西的形状而不是面向调用方的行为，测试会对真实变化失去敏感度，而且你在还没理解实现之前就锁定了测试结构。应该做垂直切分：一条测试 → 一份实现 → 重复，每条测试是一颗 tracer bullet，根据上一轮学到的东西调整。

## 循环规则

- **Red before green**：先写失败的测试，然后只写刚好让它通过的量。不预判后面的测试，不加投机性的功能。
- **一次一个切片**：一个 seam、一条测试、一份最小实现。
- **重构不属于这个循环**：它属于 review 阶段，不在 red → green 的实现循环里。

## 引导用户自己写测试（学习模式）

**测试尽量由用户自己写，不输出完整测试文件**。你来提问、讲解最小概念、审查他写的东西。

1. **先约定 seam**：用一句话说清这次要测的 public interface（函数名 + 输入类型 → 输出类型），以及它漏掉什么。
2. **先想用例，后写语法**：问他"哪些输入值得验证"，让他从官方示例 → 边界（空/单个/极值）→ 特殊（重复、负面）依次列。期望值必须来自手算或题面，不能拿和实现同构的算法再算一遍。
3. **只给最小骨架**：`describe('函数名', () => { it('一句话描述', () => { expect(实际值).toBe(期望值) }) })`。其余 API 等他用错或主动问时再讲。
4. **让他自己跑**：`npm test -- <文件路径>`，或 `npm run test:watch` 只跑相关文件。看失败信息定位问题，不要替他改断言。
5. **验证测试真的有效**：全部变绿后，让他把某条期望值临时改错、再跑一次——必须变红才证明断言真在验证（否则可能是空转）。看完再改回去。

## 环境事实

- 文件名必须是 `*.test.ts`，否则 vitest 不会收集
- `npm test` 验 behavior，`npm run typecheck` 验类型
- 时间与随机数属于系统边界：注入它，或者固定种子

规则来源：mattpocock/skills 的 tdd 与 tests 规范。
