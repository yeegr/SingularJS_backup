const webpack = require('webpack'),
  fs = require('fs'),
  path = require('path'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),

  extractLess = new ExtractTextPlugin({
    filename: "static/css/main.css"
  })

module.exports = {
  devtool: 'source-map',
  target: 'web',
  entry: {
    bundle: path.resolve(__dirname, 'src/dom/')
  },
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'js/bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx', '.json']
  },
  plugins: [
    extractLess,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    })
  ],
  externals: {
    
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
        enforce: 'pre'
      }, {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'source-map-loader',
          'babel-loader',
          'ts-loader'
        ]
      }, {
        test: /\.less$/,
        exclude: /node_modules/,
        use: extractLess.extract({
          use: [{
            loader: "css-loader",
            options: {
              minimize: true,
              sourceMap: true
            }
          }, {
            loader: "less-loader",
            options: {
              sourceMap: true
            }
          // }, {
          //   loader: "less-json-import-loader"
          }],
          fallback: "style-loader"
        })
      }, {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]!extract-loader!html-loader'
      }, {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.(jpg|gif|png|svg)$/,
        loader: 'file-loader?name=static/img/[name].[ext]'
      }
    ]
  }
}
