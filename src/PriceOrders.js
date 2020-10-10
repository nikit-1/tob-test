module.exports = class PriceOrders {
  constructor() {
    this.amount = 0
    // UNNECCESARY CODE FOR THE PURPOSE OF THIS TASK
    // this.users = new Map()
  }

  _changeAmountBy(val) {
    this.amount += val
  }

  addOrder({user_id, clorder_id, amount, amount_rest}) {
    // UNNECCESARY CODE FOR THE PURPOSE OF THIS TASK
    // let user = this.users.get(user_id) || this.users.set(user_id, new Map()).get(user_id)
    // user.set(clorder_id, amount_rest)

    this._changeAmountBy(amount_rest)
  }

  redeemOrder({user_id, clorder_id, amount, amount_rest}) {
    // UNNECCESARY CODE FOR THE PURPOSE OF THIS TASK
    // let user = this.users.get(user_id)
    // user.clorder_id = amount_rest
    // if (amount_rest === 0) user.delete(clorder_id)
    // if (user.size === 0) this.users.delete(user_id)

    this._changeAmountBy(-amount)
  }

  dropOrder({user_id, clorder_id, amount, amount_rest}) {
    // UNNECCESARY CODE FOR THE PURPOSE OF THIS TASK
    // let user = this.users.get(user_id)
    // user.delete(clorder_id)
    // if (user.size === 0) this.users.delete(user_id)

    this._changeAmountBy(-amount)
  }
}