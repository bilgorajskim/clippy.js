/* eslint node: true */
'use strict';

const webpackConfig = require('./webpack.config');
const testArgs = require('yargs').argv;
const resolve = webpackConfig.resolve, loaders = webpackConfig.module.loaders,
      plugins = webpackConfig.plugins;

const getPostLoaders = () => {
  return testArgs.noCoverage ? [] : [{
    test: /\.js$/,
    exclude: /(vendor|test|node_modules)\//,
    loader: 'istanbul-instrumenter',
  }];
};

module.exports = {
  module: {
    loaders: loaders,
    postLoaders: getPostLoaders(),
  },
  resolve: resolve,
  plugins: plugins,
};
