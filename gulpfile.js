// GUIDA:
//Inserisci l'url del sito
var basePath = "http://localhost/wordpress_root/";

//Esegui questi comandi da terminale o cmd
//npm install --save-dev gulp gulp-imagemin gulp-uglify gulp-sass browser-sync del gulp-concat gulp-clean

//Lancia gulp scrivendo "gulp" nel terminale o cmd

//Plugins
const gulp = require('gulp'); //Gulp
const imagemin = require('gulp-imagemin'); //Minify images
const uglify = require('gulp-uglify'); //Minify JS
const sass = require('gulp-sass'); //SASS
const concat = require('gulp-concat'); //Concat JS
const browserSync = require('browser-sync'); //Auto Refresh
const del = require('del'); //Delete folder
const concatCss = require('gulp-concat-css'); //Concat CSS
const cleanCSS = require('gulp-clean-css'); //Clean CSS
 
//Tasks
//Cancella cartella assets
function clean() {
    return del(['assets']);
}

//Prende tutti i file scss in src/css, li minimizza e li inserisce in style.css
function style() {
    return gulp.src('src/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream())
}

//Prende tutti i file css in src/css, li minimizza e li inserisce in assets/main.min.css
function css() {
    return gulp.src('src/css/*.css')
    .pipe(concatCss("main.min.css"))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('assets/css/'));
}

//Riduce tutte le immagini in src/img
function imageMin() {
    return gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('assets/img'))
        .pipe(browserSync.stream())
}

//Prende tutti i file js in src/js, li minimizza e li inserisce in assets/main.min.js
function scripts() {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'))
        .pipe(browserSync.stream())
}

//Auto refresh ad ogni salvataggio
function watch() {
    browserSync.init({
        proxy: basePath
    });
    gulp.watch('src/css/*.scss', style)
    gulp.watch('src/css/*.css', css)
    gulp.watch('src/img/**/*', imageMin)
    gulp.watch('src/js/*.js', scripts)
    gulp.watch('./*.php').on('change', browserSync.reload);
    gulp.watch('./src/js/*.js').on('change', browserSync.reload);
}


var build = gulp.series(clean, gulp.parallel(style, css, imageMin, scripts, watch));

exports.clean = clean;
exports.style = style;
exports.css = css;
exports.imageMin = imageMin;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from clis
 */
exports.default = build;
