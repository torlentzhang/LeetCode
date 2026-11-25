# 滑动窗口 (Sliding Window)

## 核心思想
维护一个**可变大小的窗口**，通过移动左右边界来找到满足条件的最优子数组/子串。

## 适用场景
1. **最长/最短的连续子数组/子串**
2. **包含特定字符的最小子串**
3. **无重复字符的最长子串**

## 基本模板
```typescript
function slidingWindow(s: string): number {
  let left = 0;
  let right = 0;
  let result = 0;  // 或根据题目需求初始化
  
  // 记录窗口内的状态（如字符频率）
  const windowState = new Map<string, number>();
  
  while (right < s.length) {
    // 1. 扩大窗口：将 right 位置的元素加入窗口
    const charRight = s[right];
    windowState.set(charRight, (windowState.get(charRight) || 0) + 1);
    right++;
    
    // 2. 判断是否需要缩小窗口
    while (需要收缩的条件) {
      // 3. 更新结果（根据题目需求）
      result = Math.max(result, right - left);
      
      // 4. 缩小窗口：移除 left 位置的元素
      const charLeft = s[left];
      windowState.set(charLeft, windowState.get(charLeft)! - 1);
      left++;
    }
  }
  
  return result;
}
```

## 关键要点
- **右指针主动扩张**：探索新元素
- **左指针被动收缩**：当窗口不满足条件时
- 窗口内状态的维护（如哈希表、计数器等）
- 结果更新时机：在收缩前还是收缩后

## 示例
```typescript
// 无重复字符的最长子串
// s = "abcabcbb"
// [a] → [ab] → [abc] → [abca] ❌ → [bca] → [bcab] ❌ → [cab] → ...
// 最长长度 = 3
```

## 与双指针的区别
- **双指针**：通常用于查找特定组合
- **滑动窗口**：用于查找最优的连续子数组/子串
