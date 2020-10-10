const Instrument = require('./src/Instrument')
const {parseOrderData, formOutputData} = require('./src/utils')

let instruments = {}

process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
  let order = parseOrderData(chunk);
  let instrument = instruments[order.instrument_id] = instruments[order.instrument_id] || new Instrument(order.instrument_id)
  let result = instrument.processOrder(order);
  if (result) process.stdout.write(formOutputData(result))
});

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
