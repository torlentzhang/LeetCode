import { describe, expect, it } from 'vitest'
import { findKthLargest } from './215_kth_largest_element'

/** 确定性伪随机数（mulberry32）：同一种子永远产出同一串数，失败可原样复现 */
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe('findKthLargest', () => {
  it('示例 1：[3,2,1,5,6,4]、k 为 2 时返回 5', () => {
    expect(findKthLargest([3, 2, 1, 5, 6, 4], 2)).toBe(5)
  })

  it('示例 2：[3,2,3,1,2,4,5,5,6]、k 为 4 时返回 4', () => {
    expect(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)).toBe(4)
  })

  it('示例 3：[1]、k 为 1 时返回 1', () => {
    expect(findKthLargest([1], 1)).toBe(1)
  })

  it('k 为 1 时返回最大值', () => {
    expect(findKthLargest([2, 9, 4], 1)).toBe(9)
  })

  it('k 等于数组长度时返回最小值', () => {
    expect(findKthLargest([2, 9, 4], 3)).toBe(2)
  })

  it('重复元素各算一个名次：[4,4,4,1]、k 为 3 时返回 4', () => {
    expect(findKthLargest([4, 4, 4, 1], 3)).toBe(4)
  })

  it('含负数：[-1,-5,-3]、k 为 2 时返回 -3', () => {
    expect(findKthLargest([-1, -5, -3], 2)).toBe(-3)
  })

  it('已升序：[1,2,3,4,5]、k 为 2 时返回 4', () => {
    expect(findKthLargest([1, 2, 3, 4, 5], 2)).toBe(4)
  })

  it('规模验证：300 个元素的结果与独立排序结果一致', () => {
    const next = seededRandom(20261125)
    const nums = Array.from({ length: 300 }, () => Math.floor(next() * 2001) - 1000)
    const k = 42
    // sort 是独立于堆算法的参照实现，期望值不由被测代码推导
    const expected = [...nums].sort((a, b) => b - a)[k - 1]

    expect(findKthLargest(nums, k)).toBe(expected)
  })
})
