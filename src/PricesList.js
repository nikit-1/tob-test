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
    let bestPrice = this._getCurrentBestPriceAndAmount()

    let priceOrders = this._prices.get(order.price)

    if (order.action === ACTIONS.SET_ORDER) {
      if (!priceOrders) {
        this._addPrice(order.price)
        priceOrders = this._prices.get(order.price)
      }
      priceOrders.addOrder(order)
    } else if (order.action === ACTIONS.DROP_ORDER) {
      priceOrders.dropOrder(order)
    } else {
      priceOrders.redeemOrder(order)
    }

    if (priceOrders.amount === 0) {
      this._removePrice(order.price)
    }

    return this._comparePriceAndAmount(bestPrice, this._getCurrentBestPriceAndAmount())
  }

  _addPrice(price) {
    this._positions.set(price, this._heap.size())
    this._heap.add(price)
    this._prices.set(price, new PriceOrders())
  }

  _removePrice(price) {
    this._heap.delete(this._positions.get(price))
    this._positions.delete(price)
    this._prices.delete(price)
  }

  _comparePriceAndAmount(price1, price2) {
    const hasChanges = !!Object.keys(price1).filter(x => price1[x] !== price2[x]).length
    return hasChanges ? price2 : null
  }

  _getCurrentBestPriceAndAmount() {
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