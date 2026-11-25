// 小顶堆
export class MinHeap {
  #data: number[] = []

  /**
   * 查看小顶堆长度
   * @return 堆长度
   */
  get size() {
    return this.#data.length
  }

  /**
   * 查看小顶堆是否为空
   * @return 堆是否为空
   */
  get isEmpty() {
    return this.#data.length === 0
  }

  /**
   * 查看小顶堆根节点
   * @return 根节点
   * @throws {RangeError} 堆为空时抛出
   */
  peek() {
    if (this.#data.length === 0) {
      throw new RangeError('Heap is empty')
    }
    return this.#data[0]
  }

  /**
   * 向小顶堆中加入非根节点的节点
   * @param val 节点值
   */
  push(val: number) {
    this.#data.push(val)
    let i = this.#data.length - 1
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (val > this.#data[parent]) {
        break
      }
      ;[this.#data[i], this.#data[parent]] = [this.#data[parent], this.#data[i]]
      i = parent
    }
  }

  /**
   * 弹出小顶堆根节点
   * @return 根节点
   * @throws {RangeError} 堆为空时抛出
   */
  pop() {
    if (this.#data.length === 0) {
      throw new RangeError('Heap is empty')
    }
    ;[this.#data[0], this.#data[this.#data.length - 1]] = [this.#data[this.#data.length - 1], this.#data[0]]
    const top = this.#data.pop()!
    this.#siftDown(0)
    return top
  }

  /**
   * 替换小顶堆根节点
   * @param val 新根节点
   * @throws {RangeError} 堆为空时抛出
   */
  replaceMin(val: number) {
    if (this.#data.length === 0) {
      throw new RangeError('Heap is empty')
    }
    this.#data[0] = val
    const i = 0
    this.#siftDown(i)
  }

  /**
   * 下沉操作
   * @param i 节点索引
   */
  #siftDown(i: number) {
    // 当左孩子存在
    while (2 * i + 1 < this.#data.length) {
      let smaller = 2 * i + 1
      // 右孩子存在且更小
      if (2 * i + 2 < this.#data.length && this.#data[smaller] > this.#data[2 * i + 2]) {
        smaller = 2 * i + 2
      }
      // 父节点小于等于最小孩子直接退出
      if (this.#data[i] <= this.#data[smaller]) {
        break
      }
      // 否则交换父节点与最小孩子
      ;[this.#data[i], this.#data[smaller]] = [this.#data[smaller], this.#data[i]]
      // 继续下沉更新节点索引
      i = smaller
    }
  }
}
