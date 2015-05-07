var gulp            = require('gulp');
var autoprefixer    = require('gulp-autoprefixer');
var livereload      = require('gulp-livereload');
var connect         = require('gulp-connect');
var opn             = require('opn');
var sass            = require('gulp-sass');
var jade            = require('gulp-jade');
var prettify        = require('gulp-prettify');

gulp.task('default', ['connect', 'jade', 'sass', 'watch']);



gulp.task('watch', function() {
    gulp.watch('dev/sass/*.scss', ['sass']);
    gulp.watch('dev/jade/*.jade', ['jade']);
    //gulp.watch('app/*.html', ['html']);
});

gulp.task('sass', function () {
    gulp.src('dev/sass/*.scss')
        .pipe(sass())
        .on('error', log)
        .pipe(minifyCSS({keepBreaks: true, advanced: false, compatibility: 'ie8'} ))
        .pipe(autoprefixer("last 5 versions"))
        .pipe(gulp.dest('app/css'))
        .pipe(connect.reload());
});

gulp.task('jade', function() {
    gulp.src('dev/jade/*.jade')
        .pipe(jade())
        .on('error', log)
        .pipe(prettify({"indent_size": 1,
            "indent_char": "\t"}))
        .pipe(gulp.dest('app/'))
        .pipe(connect.reload());
});



gulp.task('html', function() {
    gulp.src('app/*.html')
        .pipe(connect.reload());
});



gulp.task('connect', function() {
    connect.server({
        root: 'app',
        livereload: true,
        port:8888
    });
    //opn('http://localhost:8888/')
});

function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}
