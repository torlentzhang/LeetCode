# 深度优先搜索 (DFS)

## 核心思想
沿着一条路径**尽可能深地探索**，直到无法继续，然后回溯到上一个分叉点继续探索。

## 适用场景
1. **树的遍历**（前序、中序、后序）
2. **图的遍历**
3. **路径搜索问题**
4. **组合/排列问题**
5. **回溯问题**

## 基本模板
```typescript
function dfs(node: TreeNode, path: number[] = []): void {
  // 1. 终止条件
  if (!node) return;
  
  // 2. 处理当前节点
  path.push(node.val);
  
  // 3. 递归探索子节点
  dfs(node.left, path);
  dfs(node.right, path);
}
```

## 回溯模板
```typescript
function backtrack(choices: number[], path: number[] = []): void {
  // 1. 满足条件：记录结果
  if (满足条件) {
    result.push([...path]);
    return;
  }
  
  // 2. 遍历所有选择
  for (const choice of choices) {
    // 3. 做选择
    path.push(choice);
    
    // 4. 递归探索
    backtrack(choices, path);
    
    // 5. 撤销选择（回溯）
    path.pop();
  }
}
```

## 关键要点
- **递归终止条件**：必须有明确的退出条件，避免死循环
- **状态维护**：使用全局变量或参数传递状态
- **回溯**：撤销选择，回到上一个状态
- **剪枝**：提前排除不可能的分支，提高效率

## 示例
```typescript
// 二叉树的所有路径
function binaryTreePaths(root: TreeNode): string[] {
  const result: string[] = [];
  
  function dfs(node: TreeNode, path: string) {
    if (!node) return;
    
    path += node.val;
    
    if (!node.left && !node.right) {
      result.push(path);
      return;
    }
    
    path += '->';
    dfs(node.left, path);
    dfs(node.right, path);
  }
  
  dfs(root, '');
  return result;
}
```

## DFS vs BFS
- **DFS**：深度优先，适合找所有路径、组合问题
- **BFS**：广度优先，适合找最短路径、层级遍历
