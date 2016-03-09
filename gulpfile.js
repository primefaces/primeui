'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    del = require('del'),
    flatten = require('gulp-flatten'),
    zip = require('gulp-zip');
    
//Building only primeui.js
gulp.task('build-js', function() {
	gulp.src([
        '!components/*/*-element.js',
		'components/*/*.js'
    ])
	.pipe(concat('primeui.js'))
	.pipe(gulp.dest('build'));
});

//Building only primeui.css
gulp.task('build-css', function() {
	gulp.src([
		'components/*/*.css'
    ])
	.pipe(concat('primeui.css'))
	.pipe(gulp.dest('build'));
});

//Building only primeelements.js
gulp.task('build-element', function() {
	gulp.src([
		'components/*/*-element.js'
    ])
	.pipe(concat('primeelements.js'))
	.pipe(gulp.dest('build'));
});

//Building primeui.js, primeui.css, primelements.js at the same time
gulp.task('build-dev', ['build-js', 'build-css'], function() {
	gulp.src([
		'components/*/*-element.js'
    ])
	.pipe(concat('primeelements.js'))
	.pipe(gulp.dest('build'));
});

//Building images
gulp.task('images', function() {
    return gulp.src(['components/*/images/*.png', 'components/*/images/*.gif'])
        .pipe(flatten())
        .pipe(gulp.dest('build/images'));
});

//Building themes
gulp.task('themes', function () {
    return gulp.src(['showcase/themes/*/images/*.png', 'showcase/themes/*/*.css'])
        .pipe(gulp.dest('build/themes'));
});

//Building plugins
gulp.task('plugins', function () {
    return gulp.src(['showcase/resources/js/plugins/*.js'])
        .pipe(gulp.dest('build/plugins'));
});

//Building primeui.js and primeui.min.js
gulp.task('uglify-js', function() {
    gulp.src([
        '!components/*/*-element.js',
		'components/*/*.js'
    ])
	.pipe(concat('primeui.js'))
	.pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('primeui.min.js'))
    .pipe(gulp.dest('build'));
});

//Building primeui.css and primeui.min.css
gulp.task('uglify-css', function() {
    gulp.src([
		'components/*/*.css'
    ])
	.pipe(concat('primeui.css'))
	.pipe(gulp.dest('build'))
    .pipe(uglifycss({"uglyComments": true}))
    .pipe(rename('primeui.min.css'))
    .pipe(gulp.dest('build'));	
});

//Building primeelements.js and primeelements.min.js
gulp.task('uglify-element', function() {
    gulp.src([
		'components/*/*-element.js'
    ])
	.pipe(concat('primeelements.js'))
	.pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('primeelements.min.js'))
    .pipe(gulp.dest('build'));
});

//Cleaning previous gulp tasks from project
gulp.task('clean', function() {
	del(['build']);
});

//Building project with run sequence
gulp.task('build-all', ['uglify-js', 'uglify-css','uglify-element', 'images','themes','plugins']);

//Building distribution version with zip folder
gulp.task('distribute', ['build-all'], function() {
    return gulp.src('build/*')
		.pipe(zip('primeui.zip'))
		.pipe(gulp.dest('build'));
})



        