const webpack = require('webpack'),
  fs = require('fs'),
  path = require('path')


let nodeModules = {}

fs
.readdirSync('node_modules')
.filter(function(x) {
  return ['.bin'].indexOf(x) === -1
})
.forEach(function(mod) {
  nodeModules[mod] = 'commonjs ' + mod
})
    
module.exports = {
  devtool: 'source-map',
  target: 'node',
  entry: './src/index.ts',
  output: {
    filename: 'root.js',
    path: path.resolve(__dirname, 'dev')
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  externals: {
    'sharp': 'commonjs sharp'
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
    // global.GENTLY = false is necessary for formidable to be packed
    new webpack.DefinePlugin({ 'global.GENTLY': false})
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false
    //   }
    // })
  ]
}
