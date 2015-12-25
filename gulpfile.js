'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require('gulp-rimraf'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    Config = require('./gulpfile.config');
    
var config = new Config();

var path = {
    root: './src/demo'
};

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
    return gulp.src(config.allTypeScript)
        .pipe(tslint())
        .pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function () {
    var sourceTsFiles = [config.allTypeScript,                //path to typescript files
        config.libraryTypeScriptDefinitions, //reference to library .d.ts files
        config.appTypeScriptReferences];     //reference to app.d.ts files

    var tsResult = gulp.src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(config.tscOption));

    tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function () {
    var typeScriptGenFiles = [config.tsOutputPath,            // path to generated JS files
        config.sourceApp + '**/*.js',    // path to all JS files auto gen'd by editor
        config.sourceApp + '**/*.js.map' // path to all sourcemap files auto gen'd by editor
    ];

    // delete the files
    return gulp.src(typeScriptGenFiles, { read: false })
        .pipe(rimraf());
});

/**
 * Uglify and concatenate the svg draw related js files
 */
gulp.task('scripts', function () {
    return gulp.src(config.tsOutputPath + '**/*.js')
        .pipe(concat('svg-draw.js'))
        .pipe(gulp.dest(config.distPath))
        .pipe(rename('svg-draw.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.distPath))
        .pipe(gulp.dest(config.demoPath + 'js/'))
        .pipe(connect.reload());
});

/**
 * Connect
 */
gulp.task('connect', function () {
	connect.server({
		root: [ path.root ],
		port: 1337,
		livereload: true
	});
});


gulp.task('watch', function () {
    gulp.watch([config.allTypeScript], ['compile-ts', 'scripts']);
});

gulp.task('default', ['connect', 'compile-ts', 'scripts', 'watch']);
