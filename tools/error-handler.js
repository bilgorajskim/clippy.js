/* jslint node: true */
'use strict';

module.exports = function(title) {
  'use strict';
  let logger = require('./logger')(title);

  return function(err) {
    logger.error('{red:%s}', err.toString());
    this.emit('end');
  };
};
