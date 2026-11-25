# 二分查找 (Binary Search)

## 核心思想
每次将搜索范围**减半**，从而在 O(log N) 时间内找到目标值。

## 适用条件
- **有序数组**（或具有单调性的问题）
- 需要快速查找某个值或某个边界

## 时间复杂度
- **O(log N)** - 每次排除一半的搜索空间

## 基本模板
```typescript
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    
    if (arr[mid] === target) {
      return mid;  // 找到目标
    } else if (arr[mid] < target) {
      left = mid + 1;  // 目标在右半部分
    } else {
      right = mid - 1;  // 目标在左半部分
    }
  }
  
  return -1;  // 未找到
}
```

## 变体
1. **查找第一个等于目标的位置**
2. **查找最后一个等于目标的位置**
3. **查找第一个大于等于目标的位置**
4. **在旋转排序数组中查找**

## 关键要点
- `mid` 的计算要避免溢出：`Math.floor(left + (right - left) / 2)`
- 循环条件是 `left <= right`（包含等号）
- 每次更新 `left = mid + 1` 或 `right = mid - 1`，确保搜索范围缩小

## 示例
```typescript
// 在 [1, 3, 5, 7, 9] 中查找 5
// 第1轮：left=0, right=4, mid=2, arr[2]=5 → 找到！
```
