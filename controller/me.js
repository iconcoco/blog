const Common = require('./common')
class Me extends Common {
  constructor() {
    super({
      pageInfo: { title: '个人中心页面' }
    })
  }

  getPageInfo() {
    return this.returnData({
      name: '黎承享',
      address: '广西德保县都安乡巴荷村马肯屯',
      work: '深圳市南山区SHEIN公司'
    })
     
  }
}

module.exports = Me
