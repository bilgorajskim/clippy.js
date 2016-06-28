/* jslint node: true */
/**
 * Gulp Build
 * https://www.smore.com/clippy-js
 */
'use strict';

const gulp     = require('gulp'),
      $        = require('gulp-load-plugins')(),
      pngquant = require('imagemin-pngquant'),
      del      = require('del'),
      sequence = require('run-sequence');

const tools = require('./tools');

gulp.task('clean', (callback) => {
    return del(['./dist', './build'], callback);
});

gulp.task('build:mapfile:image', () => {
    return gulp.src('agents/**/*.png')
        .pipe(imagemin({progressive: true, use: [pngquant()]}))
        .pipe(gulp.dest('build/agents'));
});

gulp.task('build:mapfile', ['build:mapfile:image'], () => {
    return gulp.src(['agents/**/*', '!agents/**/*.png', '!agents/**/*.js'])
        .pipe(gulp.dest('build/agents'));
});

gulp.task('build:agents', ['build:mapfile'], () => {
    return gulp.src('agents/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/agents'));
});

gulp.task('build:webpack', () => {
    return tools.webpackWrapper(false);
});

gulp.task('build:webpack:watch', (callback) => {
    return tools.webpackWrapper(true, callback);
});

gulp.task('build:css', () => {
    return gulp.src('src/clippy.css')
        .pipe(gulp.dest('build'))
        .pipe(minify({compatibility: 'ie9'}))
        .pipe(gulp.dest('build'))
        .pipe(rename('clippy.min.css'))
        .pipe(gulp.dest('build'))
});

gulp.task('build:sass', () => {
    return gulp.src('src/scss/clippy.scss')
        .pipe(maps.init())
        .pipe(sass({outputStyle: 'expanded'}))
        .on('error', gutil.log)
        .pipe(maps.write())
        .pipe(gulp.dest('build'))
        .pipe(minify({compatibility: 'ie9'}))
        .pipe(rename('clippy.min.css'))
        .pipe(gulp.dest('build'));
});

gulp.task('build:js', () => {
    return gulp.src('src/**/*.js')
        .pipe(concat('clippy.js'))
        .pipe(gulp.dest('build'))
        .pipe(uglify())
        .pipe(rename('clippy.min.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('build:node', () => {
    return gulp.src(['src/**/*.js', 'node/_index.js'])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('build:babel', function() {
    return gulp.src('node/**/*.js')
        .pipe(maps.init())
        .pipe(babel())
        .pipe(gulp.dest('dist'))
        .pipe(concat('clippy.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('clippy.min.js'))
        .pipe(maps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', (cb) => {
    sequence(
        'clean', ['build-mapfile', 'build-mapfile-image', 'build-agents'],
        'build:js', 'build:sass', 'build:node', cb);
});

gulp.task('default', ['build']);
