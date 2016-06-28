const webpack = require('webpack');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const baseConfig = require('../webpack.config');

const logger = require('./logger')('Webpack-Wrapper');
const errorHandler = require('./error-handler');

function normalizeConfig(config = {}, options = {}, base = baseConfig) {
  let result = Object.assign({}, config, base);
  if (options.watch) {
    result.watch = true;
    result.devtool = 'inline-source-map';
  }
  return result;
}

module.exports = function(watch, config = {}, callback = () => {}) {
  let webpackOptions = normalizeConfig(config, {watch: true});

  let changeHandler = function(err, stats) {
    if (err) {
      errorHandler('Webpack')(err);
    }

    logger.info(stats.toString({
      colors: true,
      chunks: false,
      hash: false,
      version: false,
    }));

    if (watch) {
      watch = false;
      callback();
    }
  };

  webpack(webpackOptions, changeHandler);
};
