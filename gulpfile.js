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
    gulp.src(options.src + '/**/*jade')
        .pipe(jade())
        .pipe(gulp.dest(options.dist));
});

gulp.task('default', ['clean', 'jade2html'], function () {
    gulp.start('build');
});
