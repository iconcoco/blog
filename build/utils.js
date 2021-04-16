const glob = require('glob')
const path = require('path')

const htmlWebpackPlugin = require('html-webpack-plugin') //用于html的刷新热更新

const NODE_ENV = process.env.NODE_ENV


module.exports = {
  getClientEntry(filePath) {
    const files = glob.sync(filePath)
    let moduleName, dirname, dirArr
    return files.reduce((acc, file) => {
      // 目录
      dirname = path.dirname(file)
      dirArr = dirname.split('/')
      moduleName = dirArr[dirArr.length - 1]
      // 
      acc[moduleName] = [file]
      return acc
    }, {})
  },
  getWebpackHtml(entry) {
    const plugin = []
    Object.keys(entry).forEach(moduleName => {
      const params = {
        template: path.resolve(__dirname, '../views/template.html'),
        filename: path.resolve(__dirname, `../views/package/${moduleName}.html`),
        hash: false, //hash值 预防浏览器缓存 最好设置为true
        chunks: ['manifest', 'vendors', moduleName], //页面中需要引入的js模块片段
        chunksSortMode: 'manual' //引入模块片段的顺序
        // minify: {
        //     removeAttributeQuotes: true,
        //     collapseWhitespace: true,
        //     minifyCSS: true,
        //     minifyJS: true,
        //     removeComments: true
        // }
      }

      // if (NODE_ENV == 'development') {
      //   params.template = path.resolve(__dirname, '../views/app.html')
      //   params.filename = path.resolve(__dirname, '../public/dist/index.html')
      // }

      plugin.push(new htmlWebpackPlugin(params))
    })
    return plugin
  }
}