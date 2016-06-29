/* eslint node: true */
'use strict';

const path = require('path');

class PathConfig {
  constructor(basedir) {
    this.root = basedir;
  }

  get src() {
    return path.join(this.root, 'src');
  }

  get test() {
    return path.join(this.root, 'test');
  }

  get agents() {
    return path.join(this.root, 'agents');
  }

  get dist() {
    return path.join(this.root, 'dist');
  }
}

const defaultBase = process.cwd();

module.exports = new PathConfig(defaultBase);
