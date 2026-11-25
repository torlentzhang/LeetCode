// 4. Median of Two Sorted Arrays
// 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。
// 请你找出并返回这两个正序数组的 中位数 。
// 算法的时间复杂度应该为 O(log (m+n)) 。

function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // 确保 nums1 是较短的数组
  if (nums1.length > nums2.length) {
    return findMedianSortedArrays(nums2, nums1)
  }
  const m = nums1.length
  const n = nums2.length
  let left = 0
  let right = m
  while (left <= right) {
    const i = Math.floor((left + right) / 2)
    const j = Math.floor((m + n + 1) / 2) - i
    if (i < m && nums1[i] < nums2[j - 1]) {
      left = i + 1
    } else if (i > 0 && nums1[i - 1] > nums2[j]) {
      right = i - 1
    } else {
      const maxLeft = Math.max(nums1[i - 1] ?? -Infinity, nums2[j - 1] ?? -Infinity)
      const minRight = Math.min(nums1[i] ?? Infinity, nums2[j] ?? Infinity)
      return (m + n) % 2 === 0 ? (maxLeft + minRight) / 2 : maxLeft
    }
  }
  throw new Error('Unreachable')
}

const nums1 = [3, 5]
const nums2 = [1, 2, 4, 6, 8] // 合并后: [1,2,3,4,5,6,8]，中位数应为 4
// console.log(findMedianSortedArrays(nums1, nums2))
console.log(findMedianSortedArrays(nums1, nums2))
