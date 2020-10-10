module.exports = class Heap {
  constructor(arr = [], comparatorFunc = (a, b) => a > b, swapCallBack = () => {}) {
    this._heap = arr
    this._comparatorFunc = comparatorFunc
    this._swapCallback = swapCallBack
  }

  add(value) {
    this._heap.push(value);
    this._bubbleUp(this._heap.length - 1);
  }

  delete(index) {
    let lastIndex = this._heap.length - 1;
    this._swap(index, lastIndex);
    this._heap.splice(-1)

    this._bubbleUp(index)
    this._bubbleDown(index)
  }

  size() {
    return this._heap.length
  }

  getPeak() {
    return this._heap[0]
  }

  _getParentIndex(index) {
    return Math.floor((index - 1) / 2)
  }

  _getLeftChildIndex(index) {
    return 2 * index + 1
  }

  _getRightChildIndex(index) {
    return 2 * index + 2
  }

  _compareChildren(index) {
    const len = this._heap.length - 1;
    let leftChild = this._getLeftChildIndex(index)
    let rightChild = this._getRightChildIndex(index)

    if (leftChild > len && rightChild > len) {
      return false
    } else if (leftChild > len) {
      return rightChild
    } else if (rightChild > len) {
      return leftChild
    } else {
      return this._comparatorFunc(this._heap[leftChild], this._heap[rightChild]) ? leftChild : rightChild
    }
  }

  _bubbleDown(index) {
    let nextChild = this._compareChildren(index)
    if (nextChild === false) return true

    if (!this._comparatorFunc(this._heap[index], this._heap[nextChild])) {
      this._swap(index, nextChild);
      this._bubbleDown(nextChild)
    }
  }

  _bubbleUp(index) {
    if (index === 0) return true
    let parentIndex = this._getParentIndex(index)
    if (this._comparatorFunc(this._heap[index], this._heap[parentIndex])) {
      this._swap(index, parentIndex);
      this._bubbleUp(parentIndex)
    }
    return true
  }

  _swap(index1, index2) {
    let temp = this._heap[index1]
    this._heap[index1] = this._heap[index2]
    this._heap[index2] = temp
    this._swapCallback(this._heap[index1], this._heap[index2])
  }
}