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

// Flatten prototyping JS and copy into public JS folder:
gulp.task('pl-copy:designsystemdev-js', function(done) {
    buildConfig.prototyping.forEach(function(element) {
        if(element.javascript) {
            element.javascript.forEach(function(bundle) {
                return gulp.src(bundle.files)
                    .pipe(gulp_concat('concat.js'))
                    .pipe(gulp_rename(bundle.filename))
                    .pipe(gulp.dest('public/js'));
            });
        }
    });
    done();
});

// Copy jQuery distribution from installed package into public JS folder:
gulp.task('pl-copy:jq', function() {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('public/js'));
});