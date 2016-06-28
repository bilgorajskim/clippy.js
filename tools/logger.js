/* jslint node: true */
'use strict';

function makeLogger(prefix = 'LOG') {
  return require('eazy-logger').Logger({
    prefix: `{blue:[}{magenta:${prefix}}{blue:] }`,
    useLevelPrefixes: true,
  });
}

module.exports = makeLogger;
