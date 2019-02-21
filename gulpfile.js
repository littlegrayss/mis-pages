var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');

var paths = {
    less: ['./less/*.less']
}

gulp.task('less', function () {
    return gulp.src(paths.less)
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
    gulp.watch(paths.less, gulp.series('less'));
});