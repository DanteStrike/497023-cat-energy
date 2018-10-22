"use strict";

//SERVICE
var gulp = require("gulp");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var del = require("del");

//SASS | CSS
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var csso = require("gulp-csso");
var autoprefixer = require("autoprefixer");

//JS
var babel = require("gulp-babel");
var jsMin = require("gulp-uglify");

//IMAGE
var imageMin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");
//var mozjpeg = require("imagemin-mozjpeg");
var webp = require("gulp-webp");
var svgStore = require("gulp-svgstore");

//SERVER
var server = require("browser-sync").create();

//PATHS
var path = {
  src: {
    html: "source/*.html",
    sassMain: "source/sass/style.scss",
    sass: "source/sass/**/*.{scss,sass}",
    js: "source/js/**/*.js",
    jsSrc: ["source/js/**/*.js", "!source/js/picturefill.min.js", "!source/js/svgxuse.min.js"],
    img: "source/img/*.{png,jpg,svg}",
    svgSprite: "source/img/svg-sprite/*.svg",
    font: "source/fonts/**/*.{woff,woff2}"
  },

  build: {
    folder: "build",
    html: "build/",
    css: "build/css/",
    jsSrc: ["build/js/*", "!build/js/picturefill.min.js", "!build/js/svgxuse.min.js"],
    jsDest: "build/js/",
    img: "build/img/",
  }
}

gulp.task("clear", function () {
  return del(path.build.folder);
});

gulp.task("copy", function () {
  return gulp.src([
    path.src.html,
    path.src.js,
    path.src.img,
    path.src.font,
  ], {
    base: "source"
  })
  .pipe(gulp.dest(path.build.folder));
});

gulp.task("html", function () {
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html));
});

gulp.task("css", function () {
  return gulp.src(path.src.sassMain)
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(path.build.css))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(path.build.css))
});

gulp.task("js", function () {
  return gulp.src(path.build.jsSrc)
    .pipe(babel({
      presets: ["env"]
    }))
    .pipe(jsMin())
    .pipe(gulp.dest(path.build.jsDest))
});

gulp.task("jsChange", function () {
  return gulp.src(path.src.jsSrc)
    .pipe(babel({
      presets: ["env"]
    }))
    .pipe(jsMin())
    .pipe(gulp.dest(path.build.jsDest))
});

gulp.task("image", function () {
  return gulp.src(path.build.img + "*.{png,jpg,svg}")
    .pipe(imageMin([
      pngquant(),
      imageMin.jpegtran({progressive: true}),
      //mozjpeg({progressive: true}),
      imageMin.svgo()
    ], {verbose: true}))
    .pipe(gulp.dest(path.build.img));
});

gulp.task("webp", function () {
  return gulp.src(path.build.img + "*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(path.build.img));
});

gulp.task("svg-sprite", function () {
  return gulp.src(path.src.svgSprite)
    .pipe(imageMin([
      imageMin.svgo()
    ]))
    .pipe(svgStore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(path.build.img));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(path.src.sass, gulp.series("css", "refresh"));
  gulp.watch(path.src.html, gulp.series("html", "refresh"));
  gulp.watch(path.src.js, gulp.series("jsChange", "refresh"));
  gulp.watch(path.src.svgSprite, gulp.series("svg-sprite", "refresh"));
});

gulp.task("build", gulp.series(
  "clear",
  "copy",
  "css",
  "js",
  "webp",
  "image",
  "svg-sprite"
));

gulp.task("start", gulp.series("build", "server"));
