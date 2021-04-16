class Common {
  constructor({ pageInfo } = {}) {
    this.pageInfo = Object.assign({ title: '' }, pageInfo)
  }

  returnData (data) {
    return Object.assign(this.pageInfo || {}, data)
  }
}

module.exports = Common
