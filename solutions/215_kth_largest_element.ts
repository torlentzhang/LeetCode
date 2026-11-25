// 215. 数组中的第 K 个最大元素

// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
// 注意：是「排序后第 k 大」的元素，不是第 k 个不同的元素。

// 约束：不允许使用 sort() 直接排序，也不允许先复制数组再排序。

// 示例：
// nums = [3, 2, 1, 5, 6, 4], k = 2 → 5
// nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4 → 4
// nums = [1], k = 1 → 1

// 进阶思考：能否做到平均时间复杂度 O(n)？
import { MinHeap } from '../structures/minHeap'

export function findKthLargest(nums: number[], k: number): number {
  // 在这里写你的实现
  const minHeap = new MinHeap()
  for (let i = 0; i < nums.length; i++) {
    if (minHeap.size < k) {
      minHeap.push(nums[i])
    } else if (nums[i] > minHeap.peek()) {
      minHeap.replaceMin(nums[i])
    }
  }
  return minHeap.peek()
}
