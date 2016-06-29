/* eslint node: true */
'use strict';

const path = require('path');
const baseDir = path.join(__dirname, '../');

module.exports = {
  output: {
    library: 'clippy',
    libraryTarget: 'commonjs',
    path: path.join(baseDir, 'dist'),
    filename: 'index.js',
  },
};
