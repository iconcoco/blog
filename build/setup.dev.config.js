const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const devConfig = require('./webpack.dev.config')

const compiler = webpack(devConfig)
const CONFIG = require('./../config')

/**
 * 项目因为要跟ejs模板配合使用，需要动态将开发环境编译的js替换生成
 */
compiler.hooks.emit.tap('updateScript', (compilation, cb) => {
  for (var filename in compilation.assets) {
    if (filename.endsWith('.html')) {
      let filepath = path.join(__dirname, '..', filename.replace(/\.\.\/|\.\.\\/ig, ''))
      fs.writeFile(filepath, compilation.assets[filename].source(), (err) => {
        if(err) {
          console.log(err);
        }
      })
    }
  }
})


// 服务配置
const options = {
  //设置基本目录
  contentBase: path.resolve(__dirname, '../'),
  host: 'localhost',
  compress: true,
  port: CONFIG.port.client,
  // 允许开发服务器访问本地服务器的包JSON文件，防止跨域
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  historyApiFallback: true,
  // 设置热替换
  hot: true,
  // 设置页面引入
  inline: true,

  noInfo: false,
  overlay: true,

  proxy: {
    '*': {
      target: `http://127.0.0.1:${ CONFIG.port.server }/`,  //开发环境
      // secure: false, // 接受 运行在 https 上的服务
      changeOrigin: true
    }
  }
}

console.log(
  `devServer is run at: http://127.0.0.1:${ CONFIG.port.client }`
);


// dev server
const app = new WebpackDevServer(compiler, options)
app.listen(CONFIG.port.client, "localhost", function() {});