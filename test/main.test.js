const Instrument = require('../src/Instrument')
const {parseOrderData, formOutputData} = require('../src/utils')

describe('Testing Instruments Best Price Service', () => {

  test(`Test orders should return right values`, () => {
    let testOrders = [
      ['A;1;0;55;B;100;2;2', '55;B;100;2\n'],
      ['A;2;0;55;B;101;3;3', '55;B;101;3\n'],
      ['B;1;0;55;B;99;10;10', null],
      ['A;2;1;55;B;101;3;0', '55;B;100;2\n'],
      ['B;2;0;55;B;100;3;3', '55;B;100;5\n'],
      ['A;1;2;55;B;100;1;1', '55;B;100;4\n']
    ]
    let instruments = {}
    for (let testOrder of testOrders) {
      const order = parseOrderData(testOrder[0]);
      const instrument = instruments[order.instrument_id] = instruments[order.instrument_id] || new Instrument(order.instrument_id)
      const result = instrument.processOrder(order);
      expect(formOutputData(result)).toEqual(testOrder[1]);
    }
  })

  test(`When the best price to buy became null set it to 0 with 0 amount`, () => {
    let order = parseOrderData('A;1;0;55;B;100;2;2');
    let instrument = new Instrument(order.instrument_id)
    instrument.processOrder(order);
    order = parseOrderData('A;1;1;55;B;100;2;2');
    let result = instrument.processOrder(order);
    expect(formOutputData(result)).toEqual('55;B;0;0\n');
  })

  test(`When the best price to sell became null set it to ${Number.MAX_SAFE_INTEGER} with 0 amount`, () => {
    let order = parseOrderData('A;1;0;55;S;100;2;2');
    let instrument = new Instrument(order.instrument_id)
    instrument.processOrder(order);
    order = parseOrderData('A;1;1;55;S;100;2;2');
    let result = instrument.processOrder(order);
    expect(formOutputData(result)).toEqual(`55;S;${Number.MAX_SAFE_INTEGER};0\n`);
  })
  
})
