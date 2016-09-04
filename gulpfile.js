'use strict';

var gulp = require('gulp');
var pug = require('gulp-pug');
var gutil = require('gulp-util');
var fs = require('fs');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var options = {
    src: 'src',
    dist: 'dist',
    tmp: '.tmp',
    errorHandler: function (title) {
        return function (err) {
            gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
            this.emit('end');
        };
    },
    wiredep: {
        directory: 'bower_components',
        exclude: [/jquery/]
    }
};

fs.readdirSync('./gulp').filter(function (file) {
    return (/\.(js|coffee)$/i).test(file);
}).map(function (file) {
    if (file === 'proxy.js') {
        require('./gulp/' + file);
    } else {
        require('./gulp/' + file)(options);
    }
});

gulp.task('pug2html', function() {
    return gulp.src(options.src + '/**/*pug')
        .pipe(pug())
        .pipe(gulp.dest(options.tmp));
});

gulp.task('partials', ['pug2html'], function () {
  return gulp.src([
    // options.src + '/app/**/*.html',
    options.tmp + '/directives/partials/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('ng-mars-widgets-html.templatecache.js', {
      module: 'form.widgets',
      root: 'directives/partials'
    }))
    .pipe(gulp.dest(options.tmp))
    .pipe(gulp.dest(options.dist));
});

gulp.task('default', ['partials'], function () {
    gulp.start('build');
});
