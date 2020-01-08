// Initialize Modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
const terser = require("gulp-terser");
const plumber = require("gulp-plumber");
const wait = require("gulp-wait");
const rename = require("gulp-rename");

// File Path Variables
const files = {
  scssPath: "assets/scss/styles.scss",
  jsPath: "assets/js/scripts.js",
  cssDest: "./assets/css",
  jsDest: "./assets/js"
};

// SASS
function compileScss() {
  return src(files.scssPath)
    .pipe(wait(250))
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(dest(files.cssDest));
}

// JS
function compileJs() {
  return src(files.jsPath)
    .pipe(
      plumber(
        plumber({
          errorHandler: function(err) {
            console.log(err);
            this.emit("end");
          }
        })
      )
    )
    .pipe(terser())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest(files.jsDest));
}

// Watch
function watchFiles() {
  watch(files.jsPath, series(compileJs));
  watch(files.scssPath, series(compileScss));
}

// Default
exports.default = series(compileScss, compileJs, watchFiles);
