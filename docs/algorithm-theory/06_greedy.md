# 贪心算法 (Greedy Algorithm)

## 核心思想
每一步都做出**当前看起来最优的选择**，期望通过局部最优达到全局最优。

## 适用场景
1. **区间调度问题**
2. **跳跃游戏**
3. **分发糖果**
4. **找零钱问题**（特定面值）

## 关键特征
- **贪心选择性质**：局部最优解能导致全局最优解
- **无后效性**：之前的选择不会影响未来的选择

## 基本思路
1. 明确什么是"最优选择"
2. 证明贪心策略的正确性
3. 按贪心策略执行

## 示例 1：分发饼干
```typescript
// 每个孩子有一个胃口值 g[i]，每块饼干有一个大小 s[j]
// 如果 s[j] >= g[i]，这块饼干可以满足这个孩子
// 求最多能满足多少个孩子

function findContentChildren(g: number[], s: number[]): number {
  // 1. 排序
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  
  let child = 0;
  let cookie = 0;
  
  // 2. 贪心：用最小的饼干满足胃口最小的孩子
  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) {
      child++;  // 满足了一个孩子
    }
    cookie++;  // 饼干被消耗（无论是否满足）
  }
  
  return child;
}
```

## 示例 2：跳跃游戏
```typescript
// 每个位置可以跳跃的最大距离是 nums[i]
// 判断是否能到达最后一个位置

function canJump(nums: number[]): boolean {
  let maxReach = 0;  // 当前能到达的最远位置
  
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;  // 无法到达当前位置
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  
  return false;
}
```

## 关键要点
- **贪心策略的选择**：这是最关键的，也是最难的
- **证明正确性**：贪心不一定总是正确的，需要证明
- **与动态规划的区别**：贪心不回退，DP 会考虑所有可能

## 贪心 vs 动态规划
- **贪心**：每一步只做当前最优选择，不回退
- **DP**：考虑所有可能的选择，保存所有子问题的解
- **贪心更快**（通常 O(N log N)），但适用范围更窄
