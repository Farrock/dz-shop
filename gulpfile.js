
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


// ====================================================
// ====================================================
// ================= Сборка DIST ======================

// Очистка папки
gulp.task('clean', function () {
    return gulp.src('dist')
        .pipe(clean());
});

// Переносим HTML, CSS, JS в папку dist
gulp.task('useref', function () {
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss({keepBreaks: true, advanced: false, compatibility: 'ie8'})))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Перенос шрифтов
gulp.task('fonts', function() {
    gulp.src('app/fonts/*')
        .pipe(filter(['*.eot','*.svg','*.ttf','*.woff','*.woff2']))
        .pipe(gulp.dest('dist/fonts/'))
});

// Картинки
gulp.task('images', function () {
    return gulp.src('app/img/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img'));
});

// Остальные файлы, такие как favicon.ico и пр.
gulp.task('extras', function () {
    return gulp.src([
        'app/*.*',
        '!app/*.html'
    ]).pipe(gulp.dest('dist'));
});

// Сборка и вывод размера содержимого папки dist
gulp.task('dist', ['useref', 'images', 'fonts', 'extras'], function () {
    return gulp.src('dist/**/*').pipe(size({title: 'build'}));
});

// Собираем папку DIST (только после компиляции Jade)
gulp.task('build', ['clean', 'jade'], function () {
    gulp.start('dist');
});

// Проверка сборки
gulp.task('server-dist', function () {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: 'dist'
        }
    });
});

