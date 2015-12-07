module.exports = function karmaConfig(config) {
  config.set({

    frameworks: [
      'mocha'
    ],

    reporters: [
      // Print detailed results to console.
      'spec',

      // Output code coverage files.
      'coverage'
    ],

    files: [
      // Needed because React.js requires 'bind' and
      // phantomjs does not support it.
      'node_modules/phantomjs-polyfill/bind-polyfill.js',

      // Grab all files in the tests directory
      // that contain '_test'.
      'tests/**/*_test.*'
    ],

    preprocessors: {
      // Convert files with webpack and load sourcemaps.
      'tests/**/*_test.*': [
        'webpack',
        'sourcemap'
      ]
    },

    browsers: [
      // Run tests using PhantomJS
      'PhantomJS'
    ],

    singleRun: true,

    coverageReporter: {
      dir: 'build/coverage/',
      type: 'html'
    },

    webpack: require('./webpack.config'),

    webpackMiddleware: {
      // Hide wepack build information from output.
      noInfo: true
    }

  });
}
