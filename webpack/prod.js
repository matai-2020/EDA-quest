const path = require('path')
const merge = require('webpack-merge')
const base = require('./base')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(base, {
  mode: 'production',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        'src/index.html',
        'src/style.css',
        { from: 'src/assets', to: 'assets' }
        // { from: 'src/index.html', to: 'dist/' },
        // { from: 'src/style.css', to: 'dist/' },
      ]
    })
  ]
})
