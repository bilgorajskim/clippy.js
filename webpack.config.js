/* jslint node: true */
'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

const logger = require('./tools/logger')('Webpack');

const baseDir = __dirname;
logger.debug('Using basedir %s', baseDir);

module.exports = {
  context: __dirname,

  entry: [
    './src/index.js',
  ],

  output: {
    path: path.join(baseDir, 'dist'),
    filename: 'clippy.js',
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.coffee', '.js.coffee'],
    alias: {
      jquery: require.resolve('jquery'),
    },
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss'],
      },
      {
        test: /\.(woff2?|svg)$/,
        loader: 'url?limit=10000',
      },
      {
        test: /\.(ttf|eot)$/,
        loader: 'file',
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        loader: 'url?limit=10000',
      },
    ],
  },

  postcss: [autoprefixer],

  sassLoader: {
    includePaths: path.join(baseDir, 'scss'),
  },

  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
    }),

    new webpack.optimize.DedupePlugin(),
  ]
};
