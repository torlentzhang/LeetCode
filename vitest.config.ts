import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 只收集测试文件：solutions/ 与 structures/ 里混着大量 .ts 解法，显式限定范围比默认全盘扫描更快、更可控
    include: ['solutions/**/*.test.ts', 'structures/**/*.test.ts'],
    // 算法题只依赖 JS 运行时，不需要 DOM
    environment: 'node',
    // 测试文件都显式 import { describe, it, expect }，不注入全局变量，避免隐式依赖
    globals: false,
    // 默认 5000ms 太长：解法写成死循环时要尽快失败，而不是让整个 test 卡住
    testTimeout: 3000,
    // 每个用例前重置 mock，防止上一个用例的调用记录串到下一个
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['solutions/**/*.ts', 'structures/**/*.ts'],
      exclude: ['**/*.test.ts'],
      reporter: ['text', 'html'],
    },
  },
})
