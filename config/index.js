/* eslint node: true */
'use strict';

module.exports = {
  webpack: {
    base: require('./webpack.config'),
    commonjs: require('./webpack.commonjs.config'),
    karma: require('./webpack.karma.config'),
  },
  env: require('./env'),
  paths: require('./paths'),
  setRoot: (newRoot) => {
    self.paths.root = newRoot;
  },
  karma: require.resolve('./karma.conf'),
};
