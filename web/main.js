import Instrument from '../src/Instrument'
import {parseOrderData, formOutputData} from '../src/utils'

let instruments = {}

document.addEventListener('DOMContentLoaded', function() {
  console.log('Loaded');

  let input = document.getElementById('order-input');
  let form = document.getElementById('order-form');
  let bestBuy = document.getElementById('best-buy-price');
  let bestSell = document.getElementById('best-sell-price');
  let bestBuyString = document.getElementById('best-buy-string');
  let bestSellString = document.getElementById('best-sell-string');
  let historyList = document.getElementById('history');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let order = parseOrderData(input.value);
    let instrument = instruments[order.instrument_id] = instruments[order.instrument_id] || new Instrument(order.instrument_id)
    try {
      let result = instrument.processOrder(order);
      if (result) {
        if (order.side === 'B') {
          bestBuy.innerHTML = result.price
          bestBuyString.innerHTML = formOutputData(result)
        } else {
          bestSell.innerHTML = result.price
          bestSellString.innerHTML = formOutputData(result)
        }
      }
      let li = document.createElement('li')
      li.className = 'list-group-item'
      li.appendChild(document.createTextNode(input.value))
      historyList.appendChild(li)
      input.value = ''
    } catch(err) {
      console.log('Something went wrong');
    }
  })
})