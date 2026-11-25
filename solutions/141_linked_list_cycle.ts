// 141. linked_list_cycle

// 给你一个链表的头节点 head，判断链表中是否有环。
// 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。
// 如果链表中存在环，则返回 true；否则返回 false。

import { ListNode } from '../structures/listNode'

function hasCycle(head: ListNode | null): boolean {
  let cur = head
  const nodeSet = new Set<ListNode>()
  while (cur !== null) {
    if (nodeSet.has(cur)) {
      return true
    }
    nodeSet.add(cur)
    cur = cur.next
  }
  return false
}

function hasCycleFast(head: ListNode | null): boolean {
  if (head === null) return false
  let fast: ListNode | null = head
  let slow: ListNode | null = head
  while (fast !== null && fast.next !== null && slow !== null) {
    fast = fast.next.next
    slow = slow.next
    if (fast === slow) {
      return true
    }
  }
  return false
}

// ---- 测试用例 ----

// 有环：3 -> 2 -> 0 -> -4 -> 回到 2
function buildCycleList(): ListNode {
  const node1 = new ListNode(3)
  const node2 = new ListNode(2)
  const node3 = new ListNode(0)
  const node4 = new ListNode(-4)
  node1.next = node2
  node2.next = node3
  node3.next = node4
  node4.next = node2
  return node1
}

// 无环：1 -> 2 -> null
function buildNormalList(): ListNode {
  const node1 = new ListNode(1)
  node1.next = new ListNode(2)
  return node1
}

console.log('有环链表，期望 true，实际：', hasCycle(buildCycleList()))
console.log('无环链表，期望 false，实际：', hasCycle(buildNormalList()))
console.log('空链表，期望 false，实际：', hasCycle(null))

console.log('快慢指针 - 有环链表，期望 true，实际：', hasCycleFast(buildCycleList()))
console.log('快慢指针 - 无环链表，期望 false，实际：', hasCycleFast(buildNormalList()))
console.log('快慢指针 - 空链表，期望 false，实际：', hasCycleFast(null))
