'use strict'

const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: './dist/',
    library: 'HlsjsLPLoader',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this'
  },
  target: 'web',
  mode: 'production'
}
