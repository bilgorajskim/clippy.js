/* eslint node: true */
'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const logger = require('../tools/logger')('Webpack');

const baseDir = path.normalize(__dirname + '/..');
logger.debug('Using basedir %s', baseDir);

const buildENV = process.env.NODE_ENV || 'development';

let config = {
  context: baseDir,

  entry: [
    './src',
  ],

  output: {
    library: 'clippy',
    libraryTarget: 'umd',
    path: path.join(baseDir, 'dist'),
    filename: 'clippy.js',
  },

  externals: {
    jquery: 'jQuery',
  },

  resolve: {
    extensions: ['', '.js', '.coffee', '.js.coffee'],
    alias: {
      jquery: require.resolve('jquery'),
    },
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
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

    new ExtractTextPlugin('[name].css', {
      allChunks: true,
    }),

    new webpack.optimize.DedupePlugin(),
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  config.output.filename = 'clippy.min.js';
}

logger.info('Webpack {yellow:%s} build...', buildENV);

module.exports = config;
