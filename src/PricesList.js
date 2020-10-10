const Heap = require('./Heap');
const PriceOrders = require('./PriceOrders');
const {ACTIONS, LIST_TYPES} = require('./utils')

module.exports = class PricesList {
  constructor(type = LIST_TYPES.BUY) {
    this._type = type
    const comparatorFunction = type === LIST_TYPES.BUY ? (a, b) => a > b : (a, b) => a < b;
    const swapFunction = (val1, val2) => {
      let tmp = this._positions.get(val1)
      this._positions.set(val1, this._positions.get(val2))
      this._positions.set(val2, tmp)
    }

    // Stores all PriceOrders with non-zero amount 
    this._prices = new Map()

    // Stores all prices positions in the Heap (tracking every Heap swap)
    this._positions = new Map()

    // Stores all prices in a Heap structure 
    this._heap = new Heap([], comparatorFunction, swapFunction)
  }

  processOrder(order) {
    let bestPrice = this.getCurrentBestPriceAndAmount()

    let ordersForPrice = this._prices.get(order.price)

    if (order.action === ACTIONS.SET_ORDER) {
      if (!ordersForPrice) {
        this._positions.set(order.price, this._heap.size())
        this._heap.add(order.price)
        ordersForPrice = this._prices.set(order.price, new PriceOrders()).get(order.price)
      }
      ordersForPrice.addOrder(order)
    } else if (order.action === ACTIONS.DROP_ORDER) {
      ordersForPrice.dropOrder(order)
    } else {
      ordersForPrice.redeemOrder(order)
    }

    if (ordersForPrice.amount === 0) {
      this._prices.delete(order.price)
      const pricePositionInHeap = this._positions.get(order.price)
      this._heap.delete(pricePositionInHeap)
    }

    let newBestPrice = this.getCurrentBestPriceAndAmount();
    if (bestPrice.price !== newBestPrice.price || bestPrice.amount !== newBestPrice.amount) {
      return newBestPrice
    }
    return null
  }

  getCurrentBestPriceAndAmount() {
    let price = this._heap.getPeak()
    if (!price) {
      return {
        price: this._type === LIST_TYPES.BUY ? 0 : Number.MAX_SAFE_INTEGER,
        amount: 0
      }
    }
    return {
      price: price, 
      amount: this._prices.get(price).amount
    }
  }
}