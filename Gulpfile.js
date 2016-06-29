/* eslint node: true */
/**
 * Gulp Build
 * https://www.smore.com/clippy-js
 */
'use strict';

const gulp = require('gulp');
let $ = require('gulp-load-plugins')();
const pngquant = require('imagemin-pngquant');
const del = require('del');
const sequence = require('run-sequence');
const browserSync = require('browser-sync').create();

const tools = require('./tools');
const config = require('./config');
const logger = tools.logger('Build');

gulp.task('clean', (callback) => {
  return del(['./dist', './build'], callback);
});

gulp.task('build:mapfile:image', () => {
  return gulp.src('agents/**/*.png')
      .pipe($.imagemin({progressive: true, use: [pngquant()]}))
      .pipe(gulp.dest('dist/agents'));
});

gulp.task('build:mapfile', () => {
  return gulp.src(['agents/**/*', '!agents/**/*.png', '!agents/**/*.js'])
      .pipe(gulp.dest('dist/agents'));
});

gulp.task('build:agents:js', () => {
  return gulp.src('agents/**/*.js')
      .pipe($.uglify())
      .pipe(gulp.dest('dist/agents'));
});

gulp.task('build:agents', [
  'build:agents:js',
  'build:mapfile:image',
  'build:mapfile',
]);

gulp.task('build:webpack', () => {
  return tools.webpackWrapper(false);
});

gulp.task('build:webpack:watch', ['build:sass', 'build:agents'], (callback) => {
  return tools.webpackWrapper(true, {}, callback);
});

gulp.task('build:commonjs:watch', ['build:sass', 'build:agents'], (cb) => {
  return tools.webpackWrapper(true, config.webpack.commonjs, cb);
});

gulp.task('build:commonjs', ['build:sass', 'build:agents'], () => {
  return tools.webpackWrapper(false, config.webpack.commonjs);
});

gulp.task('build:watch', ['build:commonjs:watch', 'build:webpack:watch'], () => {
  gulp.watch('src/**/*.scss', ['build:sass']);
});

gulp.task('build:css', () => {
  return gulp.src('src/clippy.css')
      .pipe(gulp.dest('dist'))
      .pipe($.cleanCss({compatibility: 'ie9'}))
      .pipe(gulp.dest('dist'))
      .pipe($.rename('clippy.min.css'))
      .pipe(gulp.dest('dist'));
});

gulp.task('build:sass', () => {
  return gulp.src('src/scss/clippy.scss')
      .pipe($.sourcemaps.init())
      .pipe($.sass({outputStyle: 'expanded'}))
      .on('error', $.util.log)
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream());
});

gulp.task('build:js', () => {
  return gulp.src('src/**/*.js')
      .pipe($.concat('clippy.js'))
      .pipe(gulp.dest('dist'))
      .pipe($.uglify())
      .pipe($.rename('clippy.min.js'))
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream());
});

gulp.task('_dev:index', () => {
  return gulp.src('index.html').pipe(gulp.dest('dist'));
});

gulp.task('serve:dev', ['_dev:index'], () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    open: true,
    logFileChanges: false,
    files: ['dist/**/*.{js,css,html}'],
  });
});

gulp.task('build:dev', ['build:webpack:watch', 'serve:dev'], () => {
  gulp.watch('src/**/*.scss', ['build:sass']);
});

gulp.task('build:node', () => {
  return gulp.src(['src/**/*.js', 'node/_index.js'])
      .pipe($.concat('index.js'))
      .pipe(gulp.dest('dist'));
});

gulp.task('build', (cb) => {
  sequence('clean', ['build:agents', 'build:webpack', 'build:sass'], cb);
});

gulp.task('build:production', (callback) => {
  process.env.NODE_ENV = 'production';
  logger.info('Webpack %s build...', process.env.NODE_ENV);
  gulp.start('build', callback);
});

gulp.task('default', ['build']);
