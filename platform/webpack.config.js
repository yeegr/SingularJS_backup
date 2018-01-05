const webpack = require('webpack'),
  fs = require('fs'),
  path = require('path')

module.exports = {
  devtool: 'source-map',
  target: 'web',
  entry: './src/web/index.ts',
  output: {
    filename: 'root.js',
    path: path.resolve(__dirname, 'dev')
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  externals: {
    
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      },
      {
        test: /\.ts?$/,
        use: ['ts-loader']
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    })
  ]
}
