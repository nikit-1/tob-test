const Heap = require('./Heap');
const PriceOrders = require('./PriceOrders');
const {ACTIONS, LIST_TYPES} = require('./utils')

module.exports = class PricesList {
  constructor(type = LIST_TYPES.BUY) {
    this.orders = new Map()
    this.type = type
    const comparatorFunction = type === LIST_TYPES.BUY ? (a, b) => a > b : (a, b) => a < b;
    const swapFunction = (val1, val2) => {
      let tmp = this.positions.get(val1)
      this.positions.set(val1, this.positions.get(val2))
      this.positions.set(val2, tmp)
    }
    this.positions = new Map()
    this.heap = new Heap([], comparatorFunction, swapFunction)
  }

  getCurrentBestPriceAndAmount() {
    let price = this.heap.getPeak()
    if (!price) {
      return {
        price: this.type === LIST_TYPES.BUY ? 0 : Number.MAX_SAFE_INTEGER,
        amount: 0
      }
    }
    return {
      price: price, 
      amount: this.orders.get(price).amount
    }
  }

  processOrder(order) {
    let bestPrice = this.getCurrentBestPriceAndAmount()

    let ordersForPrice = this.orders.get(order.price)

    if (order.action === ACTIONS.SET_ORDER) {
      if (!ordersForPrice) {
        this.positions.set(order.price, this.heap.size())
        this.heap.add(order.price)
        ordersForPrice = this.orders.set(order.price, new PriceOrders()).get(order.price)
      }
      ordersForPrice.addOrder(order)
    } else if (order.action === ACTIONS.DROP_ORDER) {
      ordersForPrice.dropOrder(order)
    } else {
      ordersForPrice.redeemOrder(order)
    }

    if (ordersForPrice.amount === 0) {
      this.orders.delete(order.price)
      const pricePositionInHeap = this.positions.get(order.price)
      this.heap.delete(pricePositionInHeap)
    }

    let newBestPrice = this.getCurrentBestPriceAndAmount();
    if (bestPrice.price !== newBestPrice.price || bestPrice.amount !== newBestPrice.amount) {
      return newBestPrice
    }
    return null
  }
}