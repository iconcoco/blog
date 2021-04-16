const path = require('path')
const merge = require('webpack-merge')
const htmlWebpackPlugin = require('html-webpack-plugin') //用于html的刷新热更新
const BASECONFIG = require('./webpack.base.config.js')
const CONFIG = require('../config.js')


module.exports = merge(BASECONFIG, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(html|htm|xml)$/i,
        use: ['html-withimg-loader', {
          loader: 'ejs-loader',
          options: {
            esModule: false
          }
        }]
      }
    ]
  },
})

