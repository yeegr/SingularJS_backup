var webpack = require('webpack'),
  fs = require('fs'),
  path = require('path');

module.exports = {
  mode: JSON.stringify(process.env.NODE_ENV) || 'development',
  devtool: 'source-map',
  target: 'node',
  entry: './src/index.ts',
  output: {
    filename: 'root.js',
    path: path.resolve(__dirname, 'dev')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  externals: {
    'sharp': 'commonjs sharp'
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.DefinePlugin({
      'global.GENTLY' : false,  // necessary for formidable/crypto to be packed
      'process.env.NODE_ENV': "'" + JSON.stringify(process.env.NODE_ENV) + "'" || 'development'
    })
  ],
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
  }
};
