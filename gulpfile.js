
'use strict';

var gulp        = require("gulp");
var jade        = require('gulp-jade');
var prettify    = require('gulp-prettify');
var wiredep     = require('wiredep').stream;
var useref      = require('gulp-useref');
var uglify      = require('gulp-uglify');
var clean       = require('gulp-clean');
var gulpif      = require('gulp-if');
var filter      = require('gulp-filter');
var size        = require('gulp-size');
var imagemin    = require('gulp-imagemin');
var concatCss   = require('gulp-concat-css');
var minifyCss   = require('gulp-minify-css');
var browserSync = require('browser-sync');
var gutil       = require('gulp-util');
var ftp         = require('vinyl-ftp');
var sass        = require('gulp-sass');
var reload      = browserSync.reload;


// ====================================================
// ====================================================
// ============== Локальная разработка APP ============

// Компилируем Jade в html
gulp.task('jade', function() {
    gulp.src('app/jade/*.jade')
        .pipe(jade())
        .on('error', log)
        .pipe(prettify({"indent_size": 1, "indent_char": "\t"}))
        .pipe(gulp.dest('app/'))
        .pipe(reload({stream: true}));
});

// Подключаем ссылки на bower components
gulp.task('wiredep', function () {
    gulp.src('app/jade/*.jade')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('app/jade/'))
});

// Запускаем локальный сервер (только после компиляции jade)
gulp.task('server', ['jade'], function () {
    browserSync({
        notify: false,
        port: 8889,
        server: {
            baseDir: 'app'
        }
    });
});

// слежка и запуск задач
gulp.task('watch', function () {
    gulp.watch('app/jade/*.jade', ['jade']);
    gulp.watch('app/sass/*.scss', ['sass']);
    gulp.watch('bower.json', ['wiredep']);
    gulp.watch(['app/js/**/*.js',]).on('change', reload);
});

gulp.task('sass', function () {
    gulp.src('app/sass/*.scss')
        .pipe(sass())
        .on('error', log)
        .pipe(minifyCss({keepBreaks: true, advanced: false, compatibility: 'ie8'} ))
        //.pipe(autoprefixer("last 5 versions"))
        .pipe(gulp.dest('app/css'))
        .pipe(reload({stream: true}));
});

// Задача по-умолчанию
gulp.task('default', ['server', 'watch']);


// Более наглядный вывод ошибок
var log = function (error) {
    console.log(error);
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),

        error.fileName,
        error.lineNumber,
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}

