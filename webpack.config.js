var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

// Set the babel's environment variable.
process.env.BABEL_ENV = TARGET;

// Common configuration.
var common = {
  // Enable 'jsx' extension.
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      /* js(x) */
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATHS.app
      }
    ]
  },

  plugins: [
    // Automatically generate HTML which
    // loads the built bundles.
    new HtmlWebpackPlugin({
      title: 'Kanban app'
    })
  ]
};

if (TARGET === 'start' || ! TARGET) {
  module.exports = merge(common, {
    entry: PATHS.app,

    output: {
      path: PATHS.build,
      filename: 'bundle.js'
    },

    module: {
      loaders: [
        /* css */ // Inline CSS to JavaScript.
        {
          test: /\.css$/,
          loaders: ['style', 'css'], // Applied from right to left.
          include: PATHS.app
        }
      ]
    },

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
    entry: {
      app: PATHS.app,
      vendor: Object.keys(pkg.dependencies)
    },

    output: {
      path: PATHS.build,
      filename: '[name].[chunkhash].js'
    },

    module: {
      loaders: [
        /* css */ // Separate CSS files.
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: PATHS.app
        }
      ]
    },

    devtool: 'source-map',

    plugins: [
      new Clean(['build']),

      new ExtractTextPlugin('styles.[chunkhash].css'),

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
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: '[name].[chunkhash].js'
      })
    ]
  });
}
