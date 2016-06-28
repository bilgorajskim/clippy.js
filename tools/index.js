/* jslint node: true */
'use strict';

let logger = require('./logger');

module.exports = {
  logger: logger,
  errorHandler: require('./error-handler'),
  webpackWrapper: require('./webpack-wrapper'),
};
