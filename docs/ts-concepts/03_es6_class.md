# ES6 Class 与 TS 类成员修饰

## 一、class 的本质：原型链的语法糖

ES6 的 `class` 没有引入新对象模型，它只是「构造函数 + 原型」这套老机制的**新写法**：

```typescript
// ES5 写法
function MinHeap() {
  this.data = [];
}
MinHeap.prototype.push = function (val) {
  /* ... */
};

// ES6 写法（等价）
class MinHeap {
  data = [];
  push(val) {
    /* ... */
  }
}
```

理解这一点很关键，因为有两个直接后果：

| 位置                 | 归谁所有                              | 证据                |
| -------------------- | ------------------------------------- | ------------------- |
| `data = []` 这种字段 | **每个实例**各一份                    | `a.data !== b.data` |
| `push() {}` 这种方法 | **所有实例共享**，挂在 `prototype` 上 | `a.push === b.push` |

还有两个和普通函数不同的地方：

```typescript
class A {}
A(); // ❌ TypeError: Class constructor cannot be invoked without 'new'
new A(); // ✅
```

- 类**必须**用 `new` 调用
- 类声明有 TDZ：声明前访问会抛 `ReferenceError`（函数声明则会提升）

## 二、字段声明与 constructor

```typescript
class Point {
  x: number = 0; // ① 字段声明 + 初始值
  y: number; // ② 只声明，值由 constructor 给

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
```

**执行顺序**（很多人卡在这）：

1. 分配对象，确定原型
2. **按书写顺序**执行所有字段初始化（① 的 `= 0`、② 的隐式 `= undefined`）
3. 执行 `constructor` 函数体

所以字段初始值会在 constructor 里被覆盖——上面 `x = 0` 先跑，再被 `this.x = x` 覆盖。

### 方法 vs 箭头函数字段

```typescript
class Counter {
  count = 0;

  inc() {
    this.count++;
  } // 原型方法
  incArrow = () => {
    this.count++;
  }; // 实例字段，每个实例一个函数
}
```

区别只有一个，但很致命：

```typescript
const c = new Counter();
const fn = c.inc;
fn(); // ❌ this 是 undefined（严格模式）→ 报错

const fn2 = c.incArrow;
fn2(); // ✅ this 被箭头函数永久绑定到 c
```

把方法当回调传出去（`array.map(c.inc)`、`setTimeout(c.inc, 0)`）时，**普通方法会丢 this**，箭头函数字段不会。代价是每个实例多一个函数对象。

## 三、访问控制：TS 的 `private` 和 JS 的 `#` 不是一回事

这是最容易误解的一点。两种写法长得像，作用层面完全不同：

```typescript
class HeapA {
  private data: number[] = []; // TS 的 private
}

class HeapB {
  #data: number[] = []; // JS 的真私有字段
}
```

|                    | TS`private`                              | JS`#data`                  |
| ------------------ | ---------------------------------------- | -------------------------- |
| 生效层面           | **只有编译期**，纯注释级别               | **运行时**，语言级强制     |
| 运行时属性是否存在 | 存在，`Object.keys(obj)` 能看到          | 完全看不到                 |
| 能否绕过           | 能：`heap["data"]`、`(heap as any).data` | 不能，语法上就无法访问     |
| 子类能否访问       | 不能（但可绕过）                         | 不能                       |
| 与其他代码重名     | 会冲突                                   | 不会（`#` 是独立命名空间） |
| 序列化 / 打印      | 会被 JSON.stringify 输出                 | 不出现                     |

**推论**：TS 的 `private` 是「团队约定」，`#` 才是「真的锁住」。

还有两个修饰符：

```typescript
class Base {
  public a = 1; // 默认值，哪里都能访问
  protected b = 2; // 自己 + 子类能访问
  private c = 3; // 只有自己能访问
  readonly d = 4; // 只能在声明处或 constructor 里赋值
}
```

`readonly` 是 TS 独有的编译期约束，和 `const` 类似：挡住「重新赋值」，不挡「内容修改」（`readonly arr: number[]` 仍然能 `push`）。

## 四、getter / setter：把方法伪装成属性

```typescript
class MinHeap {
  #data: number[] = [];

  get size() {
    // 只定义 get → 只读属性
    return this.#data.length;
  }

  get isEmpty() {
    return this.#data.length === 0;
  }
}

const h = new MinHeap();
h.size; // 0        ← 像读属性，其实执行了函数
h.size = 10; // ❌ TypeError: 只有 getter 的属性不能赋值
```

**什么时候用 getter，什么时候用方法？**

| 用`get xxx`                | 用`xxx()`                    |
| -------------------------- | ---------------------------- |
| 无参数                     | 有参数                       |
| 纯粹读取，无副作用         | 会改变内部状态               |
| 便宜（O(1) 或可接受）      | 可能很贵（如 O(n) 计算）     |
| `heap.size`、`list.length` | `arr.pop()`、`map.entries()` |

`heap.length()` 的问题就在于：它读起来像数组的 `length`（一个属性），却要加括号。语义上它应该是 `get size`。

setter 常见于「赋值时做校验」：

```typescript
class Range {
  #min = 0;
  set min(v: number) {
    if (v > this.#max) throw new Error("min 不能大于 max");
    this.#min = v;
  }
}
```

## 五、static：属于类，不属于实例

```typescript
class MinHeap {
  static from(arr: number[]) {
    // 工厂方法
    const h = new MinHeap();
    for (const v of arr) h.push(v);
    return h;
  }

  static #counter = 0; // 静态私有字段
}

MinHeap.from([3, 1, 2]); // ✅
new MinHeap().from([1]); // ❌ 实例上访问不到
```

三个典型用途：**工厂方法**（`Array.from`、`Object.create`）、**工具函数**、**全局计数**。

注意静态方法里的 `this` 指向**类本身**，不是实例：

```typescript
class A {
  static make() {
    return new this();
  } // this === A
}
```

## 六、继承：extends / super

```typescript
abstract class PriorityQueue<T> {
  abstract push(val: T): void; // 抽象方法：只声明，不实现
  abstract pop(): T | undefined;

  drain(): T[] {
    // 模板方法：子类复用
    const out: T[] = [];
    let v: T | undefined;
    while ((v = this.pop()) !== undefined) out.push(v);
    return out;
  }
}

class MinHeap<T> extends PriorityQueue<T> {
  #data: T[] = [];

  constructor(private compare: (a: T, b: T) => number) {
    super(); // 必须第一句
  }

  push(val: T) {
    /* ... */
  }
  pop(): T | undefined {
    /* ... */
  }
}
```

四条必须记住的规则：

1. **`super()` 必须在 `this` 之前调用**——子类实例只有在父类构造完成后才存在
2. **`super.method()`** 调用父类同名方法（不写 `super.` 就是覆盖，不会自动链式调用）
3. **`abstract` 类不能 `new`**，子类必须实现所有抽象方法，否则编译报错
4. **私有字段不继承**：父类的 `#data` 子类摸不到，哪怕子类也叫 `#data`（那是另一个字段）

`abstract` 是 TS 独有的（JS 里没有），编译后就是个普通类。

## 七、常见误区

**误区 1：以为 `private` 安全**

```typescript
class H {
  private data: number[] = [1];
}
const h = new H();
console.log((h as any).data); // [1] ← 完全能拿到
```

**误区 2：在 constructor 里重复声明字段**

```typescript
class A {
  data: number[]; // 这里已经初始化为 undefined
  constructor() {
    this.data = [];
  } // 再赋值，多一次写操作
}
```

字段声明本身就会「赋值一次 undefined」。要么声明时给值，要么用 `constructor` 参数属性（`constructor(private data: number[] = [])`）。

**误区 3：忘了 `this` 绑定**

```typescript
class T {
  val = 1;
  show() {
    console.log(this.val);
  }
}
const [fn] = [new T().show, 1];
fn(); // ❌ this 丢失
```

**误区 4：对象字面量写法当类用**

```typescript
const heap = {
  data: [] as number[],
  push(v: number) {
    this.data.push(v);
  },
};
```

能做，但没有封装：`heap.data` 随时能被外部改坏，也没有继承和多实例。**凡是有「不变量」要维护的结构，就该用 class。**

## 八、回到本项目的 `MinHeap`

按上面的原则，一个「封装良好」的堆大致长这样：

```typescript
export class MinHeap {
  #data: number[] = []; // 真私有，外部无法破坏堆序

  get size(): number {
    return this.#data.length;
  } // 属性语义
  get isEmpty(): boolean {
    return this.#data.length === 0;
  }

  peek(): number | undefined {
    // 契约诚实：空堆返回 undefined
    return this.#data[0];
  }

  push(val: number): void {
    /* 上浮 */
  }
  pop(): number | undefined {
    /* 取根 + 下沉 */
  }
  replaceTop(val: number): void {
    /* pop + push 的 O(log n) 合并 */
  }
}
```

三个设计决策留给你自己判断：

- `peek()` 到底该返回 `number | undefined` 还是抛异常？
- `size` 用 getter 还是保持 `length()`？
- 要不要泛型化成 `MinHeap<T>` + 比较器？

## 关键要点

- `class` 是原型链语法糖：**字段在实例上，方法在 prototype 上**
- 字段初始化先于 `constructor` 执行；箭头函数字段能锁住 `this`，普通方法不能
- **TS 的 `private` 只有编译期，JS 的 `#` 是运行时真私有**
- `get xxx` 用于「无参 + 纯读取」；有参数或有副作用就用方法
- `static` 属于类；`extends` 的子类必须先 `super()` 再碰 `this`
- 有「不变量」要维护的数据结构，必须用 class，不能用对象字面量
