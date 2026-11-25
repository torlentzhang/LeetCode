# 双指针 (Two Pointers)

## 核心思想
使用两个指针在数组上**同向或相向移动**，避免嵌套循环，将 O(N²) 优化到 O(N)。

## 适用场景
1. **有序数组中的两数之和**
2. **移除重复元素**
3. **盛水容器问题**
4. **三数之和**

## 两种模式

### 1. 相向双指针
```typescript
// 从两端向中间移动
let left = 0;
let right = arr.length - 1;

while (left < right) {
  const sum = arr[left] + arr[right];
  if (sum === target) {
    return [left, right];
  } else if (sum < target) {
    left++;  // 需要更大的数
  } else {
    right--;  // 需要更小的数
  }
}
```

### 2. 同向双指针（快慢指针）
```typescript
// 两个指针同向移动，速度不同
let slow = 0;
let fast = 0;

while (fast < arr.length) {
  // fast 探索新元素
  // slow 指向下一个要处理的位置
  fast++;
}
```

## 关键要点
- 数组必须是**有序的**（相向双指针）
- 指针移动的逻辑要清晰（什么条件下移动哪个指针）
- 循环条件通常是 `left < right` 或 `fast < arr.length`

## 示例
```typescript
// 有序数组的两数之和
// arr = [1, 3, 5, 7, 9], target = 10
// left=0(1), right=4(9) → sum=10 → 找到！
```
