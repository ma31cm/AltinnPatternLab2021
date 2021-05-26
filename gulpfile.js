var gulp = require('gulp');
var buildConfig = require('./buildconfig.json');
var gulp_concat = require('gulp-concat');
var gulp_rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

// all js tasks for production merged into one.
gulp.task('pl-copy:distribution-js', function (done) {
    buildConfig.production.forEach(function(element) {
        if(element.javascript) {
            element.javascript.forEach(function(bundle) {
                return gulp.src(bundle.files)
                    .pipe(sourcemaps.init())
                    .pipe(gulp_concat('concat.js'))
                    .pipe(gulp_rename(bundle.filename))
                    .pipe(sourcemaps.write('./maps'))
                    .pipe(gulp.dest('dist/js'));
            });
        }
    });
    done();
});