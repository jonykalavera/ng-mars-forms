'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');
var karma = require('karma');
var concat = require('concat-stream');
var _ = require('lodash');

module.exports = function (options) {
    function listFiles(callback) {
        var wiredepOptions = _.extend({}, options.wiredep, {
            dependencies: true,
            devDependencies: true
        });
        var bowerDeps = wiredep(wiredepOptions);

        var specFiles = [
            options.src + '/**/*.spec.js',
            options.src + '/**/*.mock.js'
        ];

        var htmlFiles = [
            options.src + '/**/*.html'
        ];

        var srcFiles = [
            options.src + '/**/*.js'
        ].concat(specFiles.map(function (file) {
            return '!' + file;
        }));


        gulp.src(srcFiles)
            .pipe(concat(function (files) {
                callback(bowerDeps.js
                    .concat(_.map(files, 'path'))
                    .concat(htmlFiles)
                    .concat(specFiles));
            }));
    }

    function runTests(singleRun, done) {
        listFiles(function (files) {
            var server = new karma.Server({
                configFile: __dirname + '/../karma.conf.js',
                files: files,
                singleRun: singleRun,
                autoWatch: !singleRun
            }, done);
            server.start();
        });
    }

    gulp.task('test', ['scripts'], function (done) {
        runTests(true, function() {console.log('Great, but you can do it better ;)!');});
    });
    //gulp.task('test:auto', ['watch'], function(done) {
    //    runTests(false, done);
    //});
};
