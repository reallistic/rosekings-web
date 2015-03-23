'use strict';
var gulp = require('gulp'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream'),
    less = require('gulp-less'),
    connect = require('gulp-connect'),
    stylish = require('jshint-stylish'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util'),
    react = require('gulp-react'),
    jshint = require('gulp-jshint'),
    cache = require('gulp-cache');
var DIR = __dirname,
    LESS_INDEX = './src/styles/index.less',
    scripts = './src/js/',
    build = './build/';
var paths = {
    css: ['./src/styles/**/*.less'],
    index_js: ['./src/js/main.jsx'],
    js: ['./src/js/**/*.jsx','./src/js/**/*.js'],
    b_css: build + 'css',
    b_js: build + 'js',
    l_js: build + 'js/**/*.js'
};

// Compiles LESS > CSS 
gulp.task('less', function(){
    return gulp.src(LESS_INDEX)
        .pipe(less())
        .on('error', gutil.log)
        .pipe(gulp.dest(paths.b_css))
        .pipe(connect.reload())
        ;
});

gulp.task('compile', function(){
    return gulp.src(paths.js)
        .pipe(react({harmony:true}))
        .on('error', gutil.log)
        .pipe(gulp.dest(paths.b_js));
});

gulp.task('lint', ['compile'], function() {
  return gulp.src(paths.l_js)
    .pipe(jshint({
      esnext:true, //ecmascript 6 support
      eqeqeq:true, //prefer === and !== over == and !=
      predef:[ 'document', 'require', 'module', 'window', 'console', 'setTimeout', 'clearTimeout'], 
      globalstrict:true, //supress global strict warnings
      newcap: false //constructors need capitalized names
    }))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('js', function() {
    // Browserify/bundle the JS.
    browserify(paths.index_js)
        .transform(reactify)
        .bundle()
        .on('error', gutil.log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.b_js))
        .pipe(connect.reload())
        ;
});

// Rerun the task when a file changes
gulp.task('watch',function() {
    gulp.watch(paths.css, ['less']);
    gulp.watch(paths.js, ['compile', 'js']);
});

gulp.task('webserver', ['watch'], function() {
  connect.server({
    port: 8000,
    host: '0.0.0.0',
    livereload: true
  });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['webserver', 'less', 'js']);
