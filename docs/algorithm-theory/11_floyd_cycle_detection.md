# 快慢指针判环（Floyd Cycle Detection）

## 核心思想
两个指针从同一起点出发，`slow` 每次走 1 步，`fast` 每次走 2 步：

- **无环**：`fast` 会先走到链表末尾（`null`），循环自然结束 → 无环
- **有环**：两个指针都会进入环。`fast` 每轮比 `slow` 多走 1 步，相对距离不断缩小，最终**必定在环内相遇** → 有环

只用两个指针，空间复杂度 O(1)。

## 适用场景
1. 判断链表是否有环（本题：LeetCode 141）
2. 找环的入口节点（LeetCode 142，相遇后再从头出发同速走）
3. 找链表中点（无环场景，`fast` 到终点时 `slow` 正好在中点）
4. 判断“重复访问”类问题，且要求 O(1) 空间

## 模板代码（TypeScript）

```ts
function hasCycle(head: ListNode | null): boolean {
  if (head === null) return false;

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast !== null && fast.next !== null && slow !== null) {
    fast = fast.next.next;  // 快指针一次 2 步
    slow = slow.next;       // 慢指针一次 1 步
    if (fast === slow) {
      return true;          // 相遇 → 有环
    }
  }
  return false;             // fast 走到尽头 → 无环
}
```

## 示例

有环链表：`3 -> 2 -> 0 -> -4 -> 回到 2`

| 轮次 | slow | fast |
| --- | --- | --- |
| 0 | 3 | 3 |
| 1 | 2 | 0 |
| 2 | 0 | 2 |
| 3 | -4 | -4（相遇，有环） |

无环链表：`1 -> 2 -> null`

| 轮次 | slow | fast |
| --- | --- | --- |
| 0 | 1 | 1 |
| 1 | 2 | null（到头，无环） |

## 复杂度
- 时间：O(n)，`fast` 最多走 2n 步
- 空间：O(1)，只需要两个指针

与哈希法对比：哈希法（`Set` 记录走过的节点）时间同样 O(n)，但空间是 O(n)。

## 易错点
1. **空值检查不全**：必须同时保证 `fast !== null && fast.next !== null`，否则 `fast.next.next` 会读取 `null` 的属性。先检查 `fast.next` 再访问 `fast.next.next`，靠的是 `&&` 短路求值。
2. **`=` 写成比较**：`if (fast = slow)` 是赋值，且对象恒为真，会立刻返回 `true`；比较必须用 `===`。
3. **指针忘记推进**：每轮必须让两个指针基于**自己当前位置**前进，不能每次从 `head` 重新取。
4. **TypeScript 类型收窄**：`let fast = head` 在 `if (head === null) return false` 之后会被推断为 `ListNode`，再赋值 `fast.next.next`（可能为 `null`）会报错；应显式声明为 `ListNode | null`。
5. **`?.` 会引入 `undefined`**：链表末尾只用 `null` 表示，用 `?.` 会让类型变成 `ListNode | null | undefined`，判断逻辑变混乱，建议用显式 `!== null`。
