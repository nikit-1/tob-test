const PricesList = require('./PricesList')
const {LIST_TYPES} = require('./utils')

module.exports = class Instrument {
  constructor(id) {
    this.id = id
    this.buyPricesList = new PricesList(LIST_TYPES.BUY);
    this.sellPricesList = new PricesList(LIST_TYPES.SELL)
  }

  processOrder(order) {
    let result = {instrument_id: this.id}
    let price = order.side === LIST_TYPES.BUY ? this.buyPricesList.processOrder(order) : this.sellPricesList.processOrder(order)
    if (!price) return null
    return {...result, ...price, side: order.side}
  }
}
