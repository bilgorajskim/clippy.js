var self = module.exports = {
  webpack: {
    base: require('./webpack.config'),
    commonjs: require('./webpack.commonjs.config'),
    karma: require('./webpack.karma.config'),
  },
  paths: require('./paths'),
  setRoot: (newRoot) => {
    self.paths.root = newRoot;
  },
};
