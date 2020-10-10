exports.parseOrderData = function(str) {
  let data = str.split(';');
  return {
    user_id: data[0],
    clorder_id: data[1],
    action: data[2],
    instrument_id: Number(data[3]),
    side: data[4],
    price: Number(data[5]),
    amount: Number(data[6]),
    amount_rest: Number(data[7])
  }
}

exports.formOutputData = function(data) {
  if (data === null) return null
  return `${data.instrument_id};${data.side};${data.price};${data.amount}`
}

exports.ACTIONS = {
  SET_ORDER: '0',
  DROP_ORDER: '1',
  REDEEM_ORDER: '2'
}

exports.LIST_TYPES = {
  BUY: 'B',
  SELL: 'S'
}