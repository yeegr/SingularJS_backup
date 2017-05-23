module.exports = {
  entry: './root.ts',
  output: {
    filename: 'api.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: ['source-map-loader', 'babel-loader', 'ts-loader']
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  devtool: 'inline-source-map'
}