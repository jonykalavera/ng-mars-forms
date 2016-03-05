'use strict';

var gulp = require('gulp');
var jade = require('gulp-jade');
var gutil = require('gulp-util');
var wrench = require('wrench');

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

wrench.readdirSyncRecursive('./gulp').filter(function (file) {
    return (/\.(js|coffee)$/i).test(file);
}).map(function (file) {
    if (file === 'proxy.js') {
        require('./gulp/' + file);
    } else {
        require('./gulp/' + file)(options);
    }
});

gulp.task('jade2html', function() {
    return gulp.src(options.src + '/**/*jade')
        .pipe(jade())
        .pipe(gulp.dest(options.tmp));
});

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', ['jade2html'], function () {
  return gulp.src([
    // options.src + '/app/**/*.html',
    options.tmp + '/directives/partials/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'form.widgets',
      root: 'directives/partials'
    }))
    .pipe(gulp.dest(options.tmp))
    .pipe(gulp.dest(options.dist));
});

gulp.task('default', ['partials'], function () {
    gulp.start('build');
});
