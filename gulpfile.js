/**
 * Gulp Build
 * https://www.smore.com/clippy-js
 */

var gulp = require('gulp'), uglify = require('gulp-uglify'),
    minify = require('gulp-clean-css'), concat = require('gulp-concat'),
    maps = require('gulp-sourcemaps'), pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'), babel = require('gulp-babel'),
    rimraf = require('rimraf'), imagemin = require('gulp-imagemin');

const sequence = require('gulp-sequence');

gulp.task('clean', (callback) => { return rimraf('./dist', callback); });

gulp.task('build-mapfile-image', function() {
    return gulp.src('agents/**/*.png')
        .pipe(imagemin({progressive: true, use: [pngquant()]}))
        .pipe(gulp.dest('build/agents'));
});

gulp.task('build-mapfile', function() {
    return gulp.src(['agents/**/*', '!agents/**/*.png', '!agents/**/*.js'])
        .pipe(gulp.dest('build/agents'));
});

gulp.task('build-agents', function() {
    return gulp.src('agents/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/agents'));
});

gulp.task('build-css', function() {
    return gulp.src('src/clippy.css')
        .pipe(gulp.dest('build'))
        .pipe(minify({compatibility: 'ie9'}))
        .pipe(gulp.dest('build'))
        .pipe(rename('clippy.min.css'))
        .pipe(gulp.dest('build'))
});

gulp.task('build-js', function() {
    return gulp.src('src/**/*.js')
        .pipe(concat('clippy.js'))
        .pipe(gulp.dest('build'))
        .pipe(uglify())
        .pipe(rename('clippy.min.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('build-node', () => {
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
    let tasks = [
        ['clean'], 'build-js', 'build-css', 'build-agents', 'build-mapfile',
        'build-mapfile-image', 'build-node'
    ];

    sequence(tasks, cb);
});

gulp.task('default', ['build']);
