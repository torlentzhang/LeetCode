# LeetCode 题解练习

用 TypeScript 刷 LeetCode 的个人仓库：每题一个解法文件 + 配套的 vitest 测试，`docs/` 里按算法模式沉淀理论笔记。

## 环境要求

- Node.js `>= 22.13.0`（`.nvmrc` 指定 24，`nvm use` 即可切换）

## 快速开始

```bash
npm i

npm start solutions/001_two_sum.ts   # 用 tsx 跑单个文件
npm test                             # 跑一次全部测试
npm run test:watch                   # 边写边测（推荐）
npm run test:coverage                # 生成覆盖率报告到 coverage/

npm run typecheck                    # tsc --noEmit
npm run lint                         # eslint
npm run format                       # prettier
```

## 目录结构

```
solutions/          题解与测试（NNN_题名.ts / NNN_题名.test.ts）
structures/         可复用的数据结构（MinHeap、ListNode）
docs/
  algorithm-theory/ 算法模板与思想笔记
  ts-concepts/      TS / JS 语法笔记
```

## 约定

- 命名 `NNN_题名.ts`；测试放同目录同名加 `.test.ts`，否则 vitest 不会收集
- 测试只验证公开行为，不断言内部实现细节
- `docs/` 下按「首次遇到」的方式归档：新算法进 `algorithm-theory/`，新语法进 `ts-concepts/`
