'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    del = require('del'),
    flatten = require('gulp-flatten'),
    zip = require('gulp-zip');
    
var ngScriptsAll = ['showcase/resources/js/jquery.js','showcase/resources/js/jquery-ui.js'];
        
//Building only primeui.js
gulp.task('build-js', function() {
	gulp.src([
        'components/core/core.js',
        '!components/**/*-element.js',
		'components/**/*.js'
    ])
	.pipe(concat('primeui.js'))
	.pipe(gulp.dest('build'));
});

//Building only primeui.css
gulp.task('build-css', function() {
	gulp.src([
		'components/**/*.css'
    ])
	.pipe(concat('primeui.css'))
	.pipe(gulp.dest('build'));
});

//Building only primeelements.js
gulp.task('build-elements', function() {
	gulp.src([
		'components/**/*-element.js'
    ])
	.pipe(concat('primeelements.js'))
	.pipe(gulp.dest('build'));
});

//Building primeui.js, primeui.css, primelements.js at the same time
gulp.task('build-dev', ['build-js', 'build-css', 'build-elements']);

//Building images
gulp.task('images', function() {
    return gulp.src(['components/**/images/*.png', 'components/**/images/*.gif'])
        .pipe(flatten())
        .pipe(gulp.dest('build/images'));
});

//Building themes
gulp.task('themes', function () {
    return gulp.src(['showcase/themes/**/*'])
        .pipe(gulp.dest('build/themes'));
});

//Building plugins
gulp.task('plugins', function () {
    return gulp.src(['showcase/resources/js/plugins/*.js'])
        .pipe(gulp.dest('build/plugins'));
});

//Building primeui.js and primeui.min.js
gulp.task('build-js-prod', function() {
    gulp.src([
        'components/core/core.js',
        '!components/**/*-element.js',
		'components/**/*.js'
    ])
	.pipe(concat('primeui.js'))
	.pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('primeui.min.js'))
    .pipe(gulp.dest('build'));
});

//Building primeui.css and primeui.min.css
gulp.task('build-css-prod', function() {
    gulp.src([
		'components/**/*.css'
    ])
	.pipe(concat('primeui.css'))
	.pipe(gulp.dest('build'))
    .pipe(uglifycss({"uglyComments": true}))
    .pipe(rename('primeui.min.css'))
    .pipe(gulp.dest('build'));	
});

//Building primeelements.js and primeelements.min.js
gulp.task('build-elements-prod', function() {
    gulp.src([
		'components/**/*-element.js'
    ])
	.pipe(concat('primeelements.js'))
	.pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('primeelements.min.js'))
    .pipe(gulp.dest('build'));
});

//Build primeui-all.js
gulp.task('build-primeui-js-all', function() {
    gulp.src([
        'showcase/resources/js/jquery.js',
        'showcase/resources/js/jquery-ui.js',
        'components/core/core.js',
        '!components/**/*-element.js',
		'components/**/*.js'
    ])
	.pipe(concat('primeui-all.js'))
	.pipe(gulp.dest('build'))
    .pipe(uglify({compress: {hoist_funs: false, hoist_vars: false}}))
    .pipe(rename('primeui-all.min.js'))
    .pipe(gulp.dest('build'));
});

//Build primeui-all.css
gulp.task('build-primeui-css-all', function() {
    gulp.src([
        'showcase/resources/css/jquery-ui.css',
		'components/**/*.css'
    ])
	.pipe(concat('primeui-all.css'))
	.pipe(gulp.dest('build'))
    .pipe(uglifycss({"uglyComments": true}))
    .pipe(rename('primeui-all.min.css'))
    .pipe(gulp.dest('build'));	
});

//Build primeui-ng-all.js
gulp.task('build-primeng-all', function() {
    gulp.src(ngScriptsAll)
	.pipe(concat('primeui-ng-all.js'))
	.pipe(gulp.dest('build'))
    .pipe(uglify({compress: {hoist_funs: false, hoist_vars: false}}))
    .pipe(rename('primeui-ng-all.min.js'))
    .pipe(gulp.dest('build'));
});

//Build primeui-ng-all.css
gulp.task('build-primeng-css-all', function() {
    gulp.src([
		'showcase/resources/css/jquery-ui.css',
        'components/**/*.css'
    ])
	.pipe(concat('primeui-ng-all.css'))
	.pipe(gulp.dest('build'))
    .pipe(uglifycss({"uglyComments": true}))
    .pipe(rename('primeui-ng-all.min.css'))
    .pipe(gulp.dest('build'));	
});

//Cleaning previous gulp tasks from project
gulp.task('clean', function() {
	del(['build']);
});

//Building project with run sequence
gulp.task('build-all', ['build-js-prod', 'build-css-prod', 'build-elements-prod', 
        'build-primeui-js-all', 'build-primeui-css-all',
        'build-primeng-all', 'build-primeng-css-all', 
        'images','themes','plugins']);

//Building distribution version with zip folder
gulp.task('distribute', ['build-all'], function() {
    return gulp.src('build/**/*')
		.pipe(zip('primeui.zip'))
		.pipe(gulp.dest('build'));
})



        