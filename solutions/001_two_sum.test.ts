import { describe, expect, it } from 'vitest'
import { twoSum } from './001_two_sum'

/** 题面允许「按任意顺序返回答案」，故先把结果下标归一成升序：顺序不是契约 */
function sortedPair(result: number[]): number[] {
  return [...result].sort((a, b) => a - b)
}

/** 暴力解：枚举所有 i < j，返回全部「两元素之和等于 target」的下标对 */
function bruteForcePairs(nums: number[], target: number): number[][] {
  const pairs: number[][] = []
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) pairs.push([i, j])
    }
  }
  return pairs
}

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

describe('twoSum', () => {
  it('示例 1：[2,7,11,15]、target 9 时返回下标 0 与 1', () => {
    expect(sortedPair(twoSum([2, 7, 11, 15], 9))).toEqual([0, 1])
  })

  it('示例 2：[3,2,4]、target 6 时返回下标 1 与 2', () => {
    expect(sortedPair(twoSum([3, 2, 4], 6))).toEqual([1, 2])
  })

  it('示例 3：[3,3]、target 6 时两个 3 各用一次，返回下标 0 与 1', () => {
    expect(sortedPair(twoSum([3, 3], 6))).toEqual([0, 1])
  })

  it('含负数：[-3,4,3,90]、target 0 时返回下标 0 与 2', () => {
    expect(sortedPair(twoSum([-3, 4, 3, 90], 0))).toEqual([0, 2])
  })

  it('含 0：[0,4,3,0]、target 0 时返回下标 0 与 3', () => {
    expect(sortedPair(twoSum([0, 4, 3, 0], 0))).toEqual([0, 3])
  })

  it('规模用例：返回的下标对属于暴力解枚举出的全部合法答案', () => {
    const next = seededRandom(20261125)
    const nums = Array.from({ length: 40 }, () => Math.floor(next() * 61) - 30)
    // 用数组自身的两个元素构造 target，保证至少存在一组答案
    const target = nums[3] + nums[17]
    const accepted = bruteForcePairs(nums, target)

    expect(accepted.length).toBeGreaterThan(0)
    expect(accepted).toContainEqual(sortedPair(twoSum(nums, target)))
  })
})
