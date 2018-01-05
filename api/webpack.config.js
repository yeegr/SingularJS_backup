const webpack = require('webpack'),
  fs = require('fs'),
  path = require('path')

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
      },
      {
        test: /\.env$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    // global.GENTLY = false is necessary for formidable to be packed
    new webpack.DefinePlugin({ 'global.GENTLY' : false})
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false
    //   }
    // })
  ]
}
