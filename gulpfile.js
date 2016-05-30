var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var uglify = require("gulp-uglify");
var plumber = require("gulp-plumber");
var minifyCss = require("gulp-minify-css");

gulp.task("js", function() {
    gulp.src(["js/**/*.js","!js/min/**/*.js"])
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("output/"));
});

gulp.task("sass", function() {
    gulp.src("./scss/**/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        //.pipe(minifyCss({ keepSpecialComments: 1 }))
        .pipe(gulp.dest("output/"));
});

/* default */

gulp.task("default", function() {
    gulp.watch(["js/**/*.js","!js/min/**/*.js"],["js"]);
    gulp.watch("./scss/**/*.scss",["sass"]);
});