const Vue = require('vue')
const path = require('path')

const Common = require('./common')

class Index extends Common {
  constructor() {
    super({
      pageInfo: { title: '改版首页' }
    })
  }

  getPageInfoData() {
    return this.returnData({
      name: '黎承享',
      num: 100
    })
  }


  renderSsr() {
    const app = new Vue({
      template: `<div>Some code here</div>`
    })
    // 1. 编译者
    const renderer = require('vue-server-renderer').createRenderer({
      template: require('fs').readFileSync(path.resolve(__dirname, '../views/ssr.html'), 'utf-8')
    })
    // 2. 将app变成字符串返回
    return new Promise((resolve, reject) => {
      try {
        renderer.renderToString(app, (err, html) => {
          resolve(html)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = Index
