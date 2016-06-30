/* eslint node: true */
'use strict';

const webpackConfig = require('./webpack.config');
const path = require('path');

var config = Object.assign({}, webpackConfig);
config.entry = {};
config.module.loaders
config.devtool = 'inline-source-map';

config.module.loaders.push({
  test: /\.js$/,
  include: path.resolve('src/'),
  loader: 'isparta',
});

config.isparta = {
  embedSource: true,
  noAutoWrap: true,
  babel: {
    presets: ['es2015'],
  },
};

module.exports = config;
