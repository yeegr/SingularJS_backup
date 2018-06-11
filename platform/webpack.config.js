var webpack = require('webpack'),
  fs = require('fs'),
  path = require('path'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),

  extractLess = new ExtractTextPlugin({
    filename: 'static/css/main.css'
  });

module.exports = {
  mode: JSON.stringify(process.env.NODE_ENV) || 'development',
  devtool: 'source-map',
  target: 'web',
  entry: {
    bundle: path.resolve(__dirname, 'src/dom')
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dev'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx', '.json']
  },
  externals: {
  },
  plugins: [
    extractLess,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || '"development"'
    })
  ],
  optimization: {
    minimize: true
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
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'es2015']
            }
          }, {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }, {
        test: /\.less$/,
        exclude: /node_modules/,
        use: extractLess.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true
            }
          }, {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          // }, {
          //   loader: 'less-json-import-loader'
          }],
          fallback: 'style-loader'
        })
      }, {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]!extract-loader!html-loader'
      }, {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]'
      }, {
        test: /\.(jpg|gif|png|svg)$/,
        loader: 'file-loader?name=static/img/[name].[ext]'
      }
    ]
  }
};
