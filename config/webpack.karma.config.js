/* eslint node: true */
'use strict';

const webpackConfig = require('./webpack.config');
const testArgs = require('yargs').argv;

const getPostLoaders = () => {
  return testArgs.noCoverage ? [] : [{
    test: /\.js$/,
    exclude: /(test|node_modules)\//,
    loader: 'istanbul-instrumenter',
  }];
};

var config = Object.assign({}, webpackConfig);
config.module.postLoaders = getPostLoaders();

module.exports = config;
