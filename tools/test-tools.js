/* eslint node: true */
'use strict';

const karma = require('karma');
const Server = karma.Server;
const runner = karma.runner;

const PORT = 0;

module.exports = {
  server: function(config, watch, callback) {
    const logger = require('./logger')('Karma Server');
    const server = new Server(
        {
          configFile: config,
          singleRun: !watch,
        }, function(exitCode) {
          if (exitCode === 0) {
            callback();
          } else {
            logger.error(
                '{red:Tests failed} with exit code: {yellow:%d}', exitCode);
            throw new Error;
          }

          if (!watch) {
            process.exit(exitCode);
          }
        });

    server.on('listening', (port) => {
      logger.info('Listening on port {magenta:%d}', port);
    });

    server.on('browser_register', (browser) => {
      logger.info('Registered browser {yellow:%s}', browser);
    });

    server.on('browser_error', (browser, error) => {
      logger.error('An error occured for {yellow:%s}:\n\n{red:%s}', browser, error);
    });

    server.on('browser_start', (browser, info) => {
      logger.info('Starting run for {yellow:%s} (%s)', browser, info);
    });

    server.on('browser_complete', (browser, result) => {
      logger.info('Completed run for {yellow:%s} -- %s', browser, result);
    });

    server.start();
  },

  runner: function(config) {
    const logger = require('./logger')('Karma Runner');
    const karmaConf = require(config);
    if (PORT !== 0 && karmaConf.port !== PORT) {
      karmaConf.port = PORT;
    }

    runner.run(karmaConf, function(exitCode) {
      if (exitCode === 0) {
        logger.info('{green:%s}', 'All tests passed!');
        process.exit(0);
      } else {
        logger.error('{red:%s} (exitcode {magenta:%d})', 'Failure!', exitCode);
        process.exit(exitCode);
      }
    });
  },
};
