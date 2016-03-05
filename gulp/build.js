'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function (options) {
    gulp.task('package', function () {
        //console.log(options);
        return gulp.src([options.src + '/**/module.js', options.src + '/**/*.js'])
            .pipe($.concat('ng-mars-widgets.js'))
            .pipe(gulp.dest(options.tmp + '/'))
            // This will output the non-minified version
            .pipe(gulp.dest(options.dist + '/'))
            // This will minify and rename to foo.min.js
            .pipe($.uglify())
            .pipe($.rename({ extname: '.min.js' }))
            .pipe(gulp.dest(options.dist + '/'))
            .pipe($.size({ title: options.dist + '/', showFiles: true }));
    });

    gulp.task('clean', function (done) {
        $.del([options.dist + '/', options.tmp + '/'], done);
    });

    gulp.task('build', ['package']);
};
