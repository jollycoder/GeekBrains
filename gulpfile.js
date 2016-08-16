var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('transpile', function () {
    return gulp.src('es2015/*.js')
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(gulp.dest('es5'));
});
