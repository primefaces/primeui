'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    del = require('del'),
    flatten = require('gulp-flatten'),
    zip = require('gulp-zip');
    
//Building PrimeNg Dependencies - Js
gulp.task('build-primeng-js', function() {
    gulp.src([
        'components/core/core.js',
        '!components/button/button.js', '!components/checkbox/checkbox.js', '!components/**/*-element.js',
        '!components/datagrid/datagrid.js', '!components/datascroller/datascroller.js', '!components/datatable/datatable.js',
        '!components/fieldset/fieldset.js', '!components/inputtext/inputtext.js', '!components/inputtextarea/inputtextarea.js',
        '!components/messages/messages.js', '!components/orderlist/orderlist.js', '!components/paginator/paginator.js',
        '!components/panel/panel.js', '!components/picklist/picklist.js', '!components/progressbar/progressbar.js',
        '!components/radiobutton/radiobutton.js', '!components/rating/rating.js', '!components/togglebutton/togglebutton.js',
        '!components/selectbutton/selectbutton.js',
        'components/**/*.js'
    ])
	.pipe(concat('primeui-ng.js'))
	.pipe(gulp.dest('build'));
})
    
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
gulp.task('build-element', function() {
	gulp.src([
		'components/**/*-element.js'
    ])
	.pipe(concat('primeelements.js'))
	.pipe(gulp.dest('build'));
});

//Building primeui.js, primeui.css, primelements.js at the same time
gulp.task('build-dev', ['build-js', 'build-css'], function() {
	gulp.src([
		'components/**/*-element.js'
    ])
	.pipe(concat('primeelements.js'))
	.pipe(gulp.dest('build'));
});

//Building images
gulp.task('images', function() {
    return gulp.src(['components/**/images/*.png', 'components/*/images/*.gif'])
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

//Building primeui-ng.js and primeui-ng.min.js
gulp.task('uglify-primeui-ng-js', function() {
    gulp.src([
        'components/core/core.js',
        '!components/button/button.js', '!components/checkbox/checkbox.js', '!components/**/*-element.js',
        '!components/datagrid/datagrid.js', '!components/datascroller/datascroller.js', '!components/datatable/datatable.js',
        '!components/fieldset/fieldset.js', '!components/inputtext/inputtext.js', '!components/inputtextarea/inputtextarea.js',
        '!components/messages/messages.js', '!components/orderlist/orderlist.js', '!components/paginator/paginator.js',
        '!components/panel/panel.js', '!components/picklist/picklist.js', '!components/progressbar/progressbar.js',
        '!components/radiobutton/radiobutton.js', '!components/rating/rating.js', '!components/togglebutton/togglebutton.js',
        '!components/selectbutton/selectbutton.js',
        'components/**/*.js'
    ])
	.pipe(concat('primeui-ng.js'))
	.pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('primeui-ng.min.js'))
    .pipe(gulp.dest('build'));
});

//Building primeui.css and primeui.min.css
gulp.task('uglify-css', function() {
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
gulp.task('uglify-element', function() {
    gulp.src([
		'components/**/*-element.js'
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

//Cleaning previous primeng folder from project
gulp.task('clean-ng', function() {
	del(['build/primeng']);
});

//Building project with run sequence
gulp.task('build-all', ['uglify-js', 'uglify-css','uglify-element', 'uglify-primeui-ng-js', 'images','themes','plugins']);

//Building distribution version with zip folder
gulp.task('distribute', ['build-all'], function() {
    return gulp.src('build/*')
		.pipe(zip('primeui.zip'))
		.pipe(gulp.dest('build'));
})



        