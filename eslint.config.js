import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    // coverage/ 是覆盖率报告生成物（已被 .gitignore 忽略），不参与 lint
    ignores: ['node_modules/', 'docs/', 'coverage/'],
  },
  {
    files: ['**/*.ts'],
    // recommendedTypeChecked 需要类型信息：只有它才能发现「忘了 await 的 Promise」这类 tsc 不会报的 bug
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 递归/回调常常要先写全参数签名，用 _ 前缀显式声明「我知道它没用」
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
    },
  },
])
