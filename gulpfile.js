var gulp = require('gulp');
var jade = require('gulp-jade');
var sync = require('browser-sync');

['clock', 'voter'].forEach(function (app) {
    var jadePath = app + '/jade/*.jade';
    var jadeTask = app + ':jade';
    var syncTask = app + ':sync';

    gulp.task(jadeTask, function () {
        return gulp.src(jadePath)
            .pipe( jade({ pretty: true}) )
            .pipe( gulp.dest(app) )
            .pipe( sync.reload({ stream: true }) )
    });

    gulp.task(syncTask, function() {
        sync({
            server: { baseDir: app },
            browser: 'chrome'
        })
    });
    // задачи clock:watch и voter:watch
    gulp.task(app + ':watch', [syncTask, jadeTask], function () {
        gulp.watch(jadePath, [jadeTask]);
    });
});
