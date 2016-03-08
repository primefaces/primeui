'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');
    
gulp.task('concatScripts', function() {
	gulp.src([
		'components/*/*.js'
    ])
	.pipe(concat('primeui.js'))
	.pipe(gulp.dest('Concat'));
});
    
        