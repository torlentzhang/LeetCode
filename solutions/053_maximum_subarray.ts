// 53. 最大子数组和

// 给你一个整数数组 nums，请找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

// 示例：
// nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4] → 6（子数组 [4, -1, 2, 1]）
// nums = [1] → 1

export function maxSubArray(nums: number[]): number {
  // 在这里写你的实现
  let maxSum = nums[0]
  let cur = nums[0]
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(cur + nums[i], nums[i])
    maxSum = Math.max(maxSum, cur)
  }
  return maxSum
}
