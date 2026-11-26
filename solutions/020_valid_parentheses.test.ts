import { describe, expect, it } from 'vitest'
import { isValid } from './020_valid_parentheses'

const cases: [string, boolean][] = [
  ['', true],
  ['{[()]}', true],
  ['{[())}', false],
  ['{[()]()', false],
  ['{[(])}', false],
]

describe('isValid', () => {
  it.each(cases)('输入 %s 返回 %s', (input, expected) => {
    expect(isValid(input)).toBe(expected)
  })
})
