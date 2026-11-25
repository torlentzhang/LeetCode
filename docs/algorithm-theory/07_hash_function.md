# 哈希函数与哈希键 (Hash Function)

## 核心思想
**哈希函数**：把任意内容（对象、字符串、数组等），压缩成一个**固定大小**的值（通常是字符串或数字），且满足：
- **相同内容 → 必产生相同结果**（确定性）
- 不同内容尽量产生不同结果（低冲突）

它的本质作用：把"无法直接当键的内容"，翻译成"能当字符串键用的东西"。

## 适用场景
1. **需要"内容相等"语义的键映射**（而非引用相等）
2. **分组归类问题**：如字母异位词分组
3. **对象/数组状态当键**：如图的状态压缩、子问题记忆化
4. **去重**：把内容相同的元素归为同一键

## 前置概念：两种"相等"
理解哈希键，必须先分清两种相等：

```typescript
const a = { x: 1 };
const b = { x: 1 };

a === b;  // false ← 引用相等：内存里是两个不同对象
// 但内容相同

// Map 用的是"引用相等"
const map = new Map();
map.set(a, 'v');
map.get(b);  // undefined  ← 内容一样但不是同一个引用
map.get(a);  // 'v' ✓
```

| 方案 | 键相等判断 | 缺陷 |
|------|-----------|------|
| 普通对象 + 对象键 | 强转字符串，全是 `"[object Object]"` | 完全失效 |
| `Map` + 对象键 | 引用相等 | 内容相同但引用不同 → 当成不同键 |
| 普通对象 + 哈希函数 | 内容相等 | 需规范的哈希函数 |
| Java `HashMap` / Python `dict` | 内容相等（严格） | 需 `hashCode`/`__hash__` + 冲突处理 |

## 最朴素的哈希函数：JSON.stringify
```typescript
const hash = (obj: object) => JSON.stringify(obj);

const hashMap: Record<string, number> = {};
hashMap[hash({ a: 1 })] = 1;
hashMap[hash({ a: 1 })];  // 1 ✓（不同对象，内容相同 → 同一键）
```

## JSON.stringify 的致命缺陷（理解哈希设计的难点）
```typescript
JSON.stringify({ a: 1, b: 2 });  // '{"a":1,"b":2}'
JSON.stringify({ b: 2, a: 1 });  // '{"b":2,"a":1}'  ← 不一样！
// 同样的内容、不同的键顺序，产生了不同的哈希 → 违反"确定性"
```

**合格的哈希函数必须**：内容相同 → 哈希值必相同，与键顺序、运行时状态无关。

## 刷题实操建议
- 键是**对象/数组**且需要**引用相等** → 直接用 `Map`
- 键是**对象/数组**且需要**内容相等** → 用哈希函数生成字符串键
  - 数组键：`arr.join(',')`（元素为简单值时可用）
  - 字符串键：直接用字符串本身
  - 复杂对象键：排序属性后再 `JSON.stringify`，或手写规范化函数
- 键是**数字/字符串** → 普通对象或 `Map` 均可，`Map` 语义更清晰

## 示例：字母异位词分组
```typescript
// "eat" "tea" "tan" "ate" "nat" "bat"
// 思路：把每个单词的字符排序后当哈希键，内容相同 → 同一组
function groupAnagrams(strs: string[]): string[][] {
  const groups: Record<string, string[]> = {};
  for (const s of strs) {
    const key = s.split('').sort().join('');  // 哈希函数：排序归一化
    (groups[key] ||= []).push(s);
  }
  return Object.values(groups);
}
// "eat"→"aet", "tea"→"aet", "ate"→"aet"  同组
// "tan"→"ant", "nat"→"ant"             同组
```

## 关键要点
- 哈希函数解决的是"**内容相等**"的键映射问题，不是"引用相等"
- 合格哈希函数的核心要求：**确定性**（相同内容必同结果）
- `JSON.stringify` 是朴素哈希，但有键顺序敏感等缺陷
- 真实哈希表（Java/Python）还需处理**哈希冲突**（链地址法、开放地址法）
