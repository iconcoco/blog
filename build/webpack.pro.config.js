const path = require('path')
const fs = require('fs')
const merge = require('webpack-merge')

const CleanWebpackPlugin = require('clean-webpack-plugin') //去除打包文件中重复的文件

const BASECONFIG = require('./webpack.base.config')

const publicPath = '/dist/'

module.exports = merge(BASECONFIG, {
  mode: 'production',
  output: {
    publicPath
  },
  plugins: [
    new CleanWebpackPlugin(), //去除打包之后重复的文件名称
   
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('production')
    // }),
  ]
})
