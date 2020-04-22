'use strict';


// IMPORT DEPENDENCIES

const gulp = require('gulp');
const header = require('gulp-header');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const flatten = require('gulp-flatten');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const connect = require('gulp-connect');


// PACKAGE INFO FOR HEADERS

const packageInfo = require('./package.json');


// GLOBAL PATHS

const paths = {
    styles: {
        input: 'src/scss/*.{scss,sass}',
        output: 'dist/css/'
    },
    fonts: {
        input: 'src/fonts/*.*',
        output: 'dist/fonts/'
    },
    js:{

        input: 'demoSrc/*.js',
        output: 'demoDist/'
    },
    demoStyles: {
        input: 'demoSrc/**/*.{scss,sass}',
        output: 'demoDist/'
    }
};


// BANNER

const banner = {
    full: `/*!\n   <%= package.name %> v<%= package.version %>: <%= package.description %>\n   (c) ${new Date().getFullYear()} <%= package.author.name %>\n   MIT License\n   <%= package.repository.url %>\n*/\n`,
    min: `/*! <%= package.name %> v<%= package.version %> | (c) ${new Date().getFullYear()} <%= package.author.name %> | MIT License | <%= package.repository.url %> */\n`
};


// CSS

gulp.task('css', function() {
    gulp.src(paths.styles.input)
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(flatten())
        .pipe(autoprefixer({
            browsers: ['last 3 version'],
            cascade: true,
            remove: true
        }))
        .pipe(header(banner.full, { package: packageInfo }))
        .pipe(gulp.dest(paths.styles.output))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(header(banner.min, { package: packageInfo }))
        .pipe(gulp.dest(paths.styles.output))
        .pipe(connect.reload());
});

// FONTS

gulp.task('fonts', function() {
    gulp.src(paths.fonts.input)
        .pipe(plumber())
        .pipe(gulp.dest(paths.fonts.output))
});
// JS

gulp.task('demo-js', function() {
    gulp.src(paths.js.input)
        .pipe(plumber())
        .pipe(gulp.dest(paths.js.output))
});


// DEMO CSS

gulp.task('demo-css', function() {
    gulp.src(paths.demoStyles.input)
        .pipe(plumber())
        .pipe(sass())
        .pipe(flatten())
        .pipe(autoprefixer({
            browsers: ['last 3 version'],
            cascade: true,
            remove: true
        }))
        .pipe(cssnano({
            discardComments: {
                removeAll: true
            },
            zindex: false
        }))
        .pipe(gulp.dest(paths.demoStyles.output))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('index.html')
    .pipe(connect.reload());
});


// CONNECT

gulp.task('connect', function() {
    connect.server({
        port: 3000,
        livereload: true
    });
});


// WATCH

gulp.task('watch', function() {
    gulp.watch(paths.styles.input, ['css']);
    gulp.watch(paths.demoStyles.input, ['demo-css']);
    gulp.watch(['index.html'], ['html']);
});



// TASKS

gulp.task('default', ['connect', 'css', 'demo-css', 'demo-js','fonts', 'watch']);
gulp.task('build', ['css', 'demo-css', 'demo-js']);
