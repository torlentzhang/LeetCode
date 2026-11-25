# 小顶堆与 Top-K 模式 (Min-Heap / Priority Queue)

## 核心思想

**堆**是一棵**完全二叉树**，并且每个父节点都 ≤ 它的子节点（小顶堆）。因此**最小值永远在根**，取它是 `O(1)`，插入和替换是 `O(log n)`。

完全二叉树不需要节点指针，直接用**数组**存储，父子关系由下标算出：

```
        1        ← 下标 0
       / \
      3   2      ← 下标 1、2
     / \
    5   4        ← 下标 3、4

左孩子 = 2i + 1
右孩子 = 2i + 2
父节点 = (i - 1) >> 1      // 等价于 Math.floor((i - 1) / 2)
```

**Top-K 模式的本质**：用一个大小为 `k` 的堆维护“目前的 k 个候选”，堆顶当**守门员** —— 它是这 k 个候选里**最容易被淘汰**的那个。每个新元素只和守门员比一次，不合格直接丢弃。

## 选小顶堆还是大顶堆

| 题目 | 堆类型 | 堆里装什么 | 堆顶是谁 |
| --- | --- | --- | --- |
| 第 k **大** / 前 k 大 | **小**顶堆 | 最大的 k 个 | 这 k 个里最小的（守门员） |
| 第 k **小** / 前 k 小 | **大**顶堆 | 最小的 k 个 | 这 k 个里最大的（守门员） |

口诀：**堆顶站“最弱”的那个**。求第 k 大时最弱的是最小值，所以用小顶堆；反过来求第 k 小时最弱的是最大值，所以用大顶堆。

## 适用场景（题目关键词）

1. **第 k 大 / 第 k 小元素**、**前 k 个高频元素**、**前 k 个最接近的元素**
2. **数据流中的第 k 大**（数据不断到来，无法整体排序）
3. **合并 k 个有序链表 / 数组**（每次从 k 个头部取最小）
4. **Dijkstra 最短路**、**A\*** 等需要反复取最小值的算法
5. **滑动窗口最大值**（单调队列也可，堆是通用解）

## 模板代码

```typescript
// 小顶堆：最小值在 data[0]
export class MinHeap {
  private data: number[] = [];

  length(): number {
    return this.data.length;
  }

  peek(): number {
    return this.data[0];
  }

  /** 插入：放到末尾，然后上浮 */
  push(val: number) {
    this.data.push(val);
    let i = this.data.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (val > this.data[parent]) break;      // 已满足 父 ≤ 子，停
      [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
      i = parent;
    }
  }

  /** 替换根：把根改成新值，然后下沉 */
  replaceTop(val: number) {
    this.data[0] = val;
    let i = 0;
    while (2 * i + 1 < this.data.length) {     // 有左孩子才可能下沉
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smaller = left;
      if (right < this.data.length && this.data[smaller] > this.data[right]) {
        smaller = right;
      }
      if (this.data[i] <= this.data[smaller]) break;
      [this.data[i], this.data[smaller]] = [this.data[smaller], this.data[i]];
      i = smaller;
    }
  }
}

// Top-K 通用骨架（以「第 k 大」为例）
function findKthLargest(nums: number[], k: number): number {
  const heap = new MinHeap();
  for (const n of nums) {
    if (heap.length() < k) {
      heap.push(n);                  // 未满，直接入堆
    } else if (n > heap.peek()) {
      heap.replaceTop(n);            // 满了且比守门员大，踢掉守门员
    }
  }
  return heap.peek();                // 堆顶就是第 k 大
}
```

## 示例：模拟执行

`nums = [3, 1, 4, 2]`, `k = 2`，维护大小为 2 的小顶堆：

```
读 3: 堆未满          → push   → [3]        根 3
读 1: 堆未满          → push   → [1, 3]     根 1（上浮，1 比 3 小）
读 4: 满了，4 > 1     → replaceTop → [3, 4]  根 3（4 踢掉 1，再下沉）
读 2: 满了，2 < 3     → 丢弃   → [3, 4]     根 3
返回 3  ✓（排序后 4, 3, 2, 1，第 2 大是 3）
```

## 易错点

- **Top-K 用错堆方向**：求第 k 大却用大顶堆，堆顶是最大值，永远轮不到它被替换，逻辑失效
- **容量判断写成 `<= k`**：`length === k` 时堆已满，必须是 `push` 之外的分支，否则堆会长到 `k+1` 个
- **下沉循环条件写 `i < data.length`**：叶子节点也满足，会越界取到 `undefined`。正确条件是有孩子：`2 * i + 1 < data.length`
- **找较小孩子时比较了“下标”而不是“值”**：`data[right] < data[smaller]`，别写成 `right < smaller`
- **判断右孩子存在写成 `right <= data.length`**：有效下标是 `0 ~ length-1`，必须严格小于
- **`parent` 写成循环外的 `const`**：上浮时父节点下标会跟着 `i` 变，必须每轮重新计算
- **在类里用 `function` 声明方法**：`function push(){}` 会丢失 `this`，类方法直接写方法名即可

## 关键要点

- Top-K 的思维核心：**只保留 k 个候选，用堆顶当守门员，不合格的新元素不进入**
- **堆顶站最弱者**：第 k 大用小顶堆，第 k 小用大顶堆
- 时间复杂度 `O(n log k)`、空间 `O(k)`，比全排序 `O(n log n)` 更适合 k 远小于 n 的场景
- 进阶：**快速选择（Quickselect）** 基于快排 partition，平均 `O(n)`，但最坏 `O(n²)`；堆方案更稳定、更适合数据流
