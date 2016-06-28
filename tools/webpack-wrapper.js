const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

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

    if (stats.hasErrors()) {
      errorHandler('Webpack')(stats.toJson().errors);
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

  return gulp.src('src/**/*.js')
      .pipe(webpackStream(webpackOptions, webpack, changeHandler))
      .pipe(gulp.dest('dist'));
};
