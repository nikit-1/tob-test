# Best buy & sell price service

This service is created just for the purpose of the algorithm and data structure testing.
The task is to return the best price (for the current instrument) after processing a new order.

Order string format:
```
user_id;clorder_id;action;instrument_id;side;price;amount;amount_rest
```
Example
```
A;1;0;55;B;100;2;2
```

## How to use

### Install dependencies
If you going to use only cli version then skip this step.
```
npm i
```

### CLI version
```
npm run start-cli
```

### Web version
Simple web version
```
npm run start-web
```

### Tests
Some simple tests
```
npm run test
```