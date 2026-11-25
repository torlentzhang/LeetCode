import { describe, expect, it } from 'vitest'
import { MinHeap } from './minHeap'

/**
 * 确定性伪随机数（mulberry32）：同一种子永远产出同一串数
 * 用它代替 Math.random()，测试失败后能原样复现
 */
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 弹出全部元素，得到堆输出的序列 */
function drain(h: MinHeap) {
  const out: number[] = []
  while (!h.isEmpty) out.push(h.pop())
  return out
}

describe('MinHeap', () => {
  describe('空堆', () => {
    it('size 为 0', () => {
      expect(new MinHeap().size).toBe(0)
    })

    it('isEmpty 为 true', () => {
      expect(new MinHeap().isEmpty).toBe(true)
    })

    it('peek() 抛 RangeError', () => {
      expect(() => new MinHeap().peek()).toThrow(RangeError)
    })

    it('pop() 抛 RangeError', () => {
      expect(() => new MinHeap().pop()).toThrow(RangeError)
    })

    it('replaceMin() 抛 RangeError', () => {
      expect(() => new MinHeap().replaceMin(1)).toThrow(RangeError)
    })
  })

  describe('基本进出', () => {
    it('size 随 push 累加', () => {
      const h = new MinHeap()
      h.push(5)
      expect(h.size).toBe(1)

      for (const v of [3, 8, 1]) h.push(v)
      expect(h.size).toBe(4)
    })

    it('peek 始终返回最小元素', () => {
      const h = new MinHeap()
      for (const v of [5, 3, 8, 1]) h.push(v)

      expect(h.peek()).toBe(1)
    })
  })

  describe('pop 有序性', () => {
    it('按升序返回元素', () => {
      const h = new MinHeap()
      for (const v of [7, 2, 9, 4, 1, 8, 3]) h.push(v)

      expect(drain(h)).toEqual([1, 2, 3, 4, 7, 8, 9])
    })

    it('弹出全部元素后 size 归零', () => {
      const h = new MinHeap()
      for (const v of [7, 2, 9, 4, 1, 8, 3]) h.push(v)

      drain(h)
      expect(h.size).toBe(0)
    })
  })

  describe('重复元素', () => {
    it('重复元素的每个副本都被返回', () => {
      const h = new MinHeap()
      for (const v of [4, 4, 2, 4, 2]) h.push(v)

      expect(drain(h)).toEqual([2, 2, 4, 4, 4])
    })
  })

  describe('边界', () => {
    it('单元素堆 peek 返回该元素', () => {
      const h = new MinHeap()
      h.push(-5)

      expect(h.peek()).toBe(-5)
    })

    it('单元素堆 pop 后变为空堆', () => {
      const h = new MinHeap()
      h.push(-5)

      expect(h.pop()).toBe(-5)
      expect(h.isEmpty).toBe(true)
    })

    it('负数混排时 peek 返回最小值', () => {
      const h = new MinHeap()
      for (const v of [-1, -9, 0, 3]) h.push(v)

      expect(h.peek()).toBe(-9)
    })

    it('负数混排时按升序返回', () => {
      const h = new MinHeap()
      for (const v of [-1, -9, 0, 3]) h.push(v)

      expect(drain(h)).toEqual([-9, -1, 0, 3])
    })
  })

  describe('replaceMin', () => {
    it('不改变 size', () => {
      const h = new MinHeap()
      for (const v of [3, 5, 8, 10]) h.push(v)

      h.replaceMin(4)
      expect(h.size).toBe(4)
    })

    it('换成更小的值后，该值成为堆顶', () => {
      const h = new MinHeap()
      for (const v of [3, 5, 8, 10]) h.push(v)

      h.replaceMin(4)
      expect(h.peek()).toBe(4)
    })

    it('换成更大的值后，次小值成为堆顶', () => {
      const h = new MinHeap()
      for (const v of [3, 5, 8, 10]) h.push(v)

      h.replaceMin(20)
      expect(h.peek()).toBe(5)
    })

    it('替换后整体仍按升序返回', () => {
      const h = new MinHeap()
      for (const v of [3, 5, 8, 10]) h.push(v)

      h.replaceMin(20)
      expect(drain(h)).toEqual([5, 8, 10, 20])
    })
  })

  describe('单子节点', () => {
    it('两元素堆 pop 后，剩余元素成为堆顶', () => {
      const h = new MinHeap()
      h.push(1)
      h.push(2)

      expect(h.pop()).toBe(1)
      expect(h.peek()).toBe(2)
    })
  })

  describe('规模验证', () => {
    it('200 个元素的返回顺序与升序排序结果一致', () => {
      // sort 是独立于堆算法的参照实现，期望值不由被测代码推导
      const next = seededRandom(20261125)
      const nums = Array.from({ length: 200 }, () => Math.floor(next() * 1000) - 500)
      const h = new MinHeap()
      for (const v of nums) h.push(v)

      expect(drain(h)).toEqual([...nums].sort((a, b) => a - b))
    })
  })

  describe('封装', () => {
    it('内部存储不出现在实例的可枚举属性中', () => {
      const h = new MinHeap()
      h.push(1)

      expect(Object.keys(h)).toEqual([])
    })
  })
})
