var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

// Set the babel's environment variable.
process.env.BABEL_ENV = TARGET;

// Common configuration.
var common = {
  entry: PATHS.app,

  // Enable 'jsx' extension.
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      /* css */
      {
        test: /\.css$/,
        loaders: ['style', 'css'], // Applied from right to left.
        include: PATHS.app // Specify target directory.
      },

      /* js(x) */
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATHS.app
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Kanban app'
    })
  ]
};

if (TARGET === 'start' || ! TARGET) {
  module.exports = merge(common, {
    // devtool: 'eval-source-map',
    devtool: 'eval',

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
    ]
  });
}

// For production.
if (TARGET === 'build') {
  module.exports = merge(common, {
    output: {
      path: PATHS.build,
      filename: 'bundle.js'
    },

    devtool: 'source-map',

    plugins: [
      // Replace environment variables (NODE_ENV) in sources
      // with the specified values ("production").
      new webpack.DefinePlugin({
        // The value of 'NODE_ENV' affects React lib size.
        // see: https://facebook.github.io/react/downloads.html
        //      http://qiita.com/hokaccha/items/474d011473eeba8dd416
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}
