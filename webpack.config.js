var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

module.exports = {
  entry: PATHS.app,

  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'], // Applied from right to left.
        include: PATHS.app // Specify target directory.
      }
    ]
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
    // XXX: 理解しきれていないが、これがないとファイルの変更があっても
    //      ページが自動でリフレッシュされない。
    inline: true,
    progress: true,

    // display only errors to reduce the amount of output.
    stats: 'errors-only',

    // parse host and port from env so this is easy to customize.
    host: process.env.HOST,
    port: process.env.PORT
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      title: 'Kanban app'
    })
  ]
};
