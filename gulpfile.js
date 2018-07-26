var gulp = require('gulp');
var sass = require('gulp-sass')
var jshint = require('gulp-jshint');
var notify = require("gulp-notify");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var uncss = require('postcss-uncss');
var inject = require('gulp-inject');
var replace = require('gulp-replace');
var jasmineBrowser = require('gulp-jasmine-browser');
var fs = require('fs');
var connect = require('gulp-connect');
var version = JSON.parse(fs.readFileSync('./package.json')).version;
var debug = true;

function errorHandler(error) {
  notify({
    title: 'Gulp Task Error',
    message: 'Check the console.'
  }).write(error);
  console.log(error.toString());
  this.emit('end');
}

gulp.task('testFixtures', function () {
  return gulp.src([
      './dist/index.html', './dist/app.js', './dist/style.css',
    ])
    .pipe(gulp.dest('spec/fixtures'));
})

gulp.task('test', function () {
  var filesForTest = [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/jasmine-jquery/lib/jasmine-jquery.js',
    'spec/fixtures/*',
    'spec/app_spec.js'
  ];
  return gulp.src(filesForTest, { base: '.' })
    .pipe(watch(filesForTest, { base: '.' }))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
})

gulp.task('views', function () {
  var stream = gulp.src('./src/index.html')
    .pipe(replace('%%GULP_INJECT_PATH%%', ''))
    .pipe(replace('%%GULP_INJECT_VERSION%%', version));

  if (debug == false) {
    stream.pipe(replace('%%GULP_INJECT_DEFAULT_SELECTOR%%', 'table.wikitable'))
    stream.pipe(replace('%%GULP_INJECT_DEFAULT_URL%%', ''))
  } else {
    stream.pipe(replace('%%GULP_INJECT_DEFAULT_SELECTOR%%', 'table.wikitable'))
    stream.pipe(replace('%%GULP_INJECT_DEFAULT_URL%%', 'https://en.wikipedia.org/wiki/List_of_world_sports_championships'))
  }

  return stream
    .on('error', errorHandler)
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
})

gulp.task('scripts', function  () {
  var stream = gulp.src([

      // Vendor
      './node_modules/clipboard/dist/clipboard.js',

      // app
      './src/js/helper.js',      
      './src/js/methods.js',      
      './src/js/app.js',      

    ], {
      base: './src'
    })
    .pipe(replace('%%GULP_INJECT_DEBUG%%', debug))
    .pipe(concat('app.js'));

  if (debug == false) {
    stream.pipe(uglify());
  }

  return stream
    .on('error', errorHandler)
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
})

gulp.task('styles', function () {
  return gulp.src('./src/sass/style.scss')
    .pipe(
      sass({outputStyle: 'compressed'})
      .on('error', errorHandler)
    )
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
})

gulp.task('postcss', function () {
  var postcssPlugins = [
    uncss({
      html: ['./dist/index.html'],
      ignore: [
        /\.table2csv.*/,
        /\.btn\-.+/,
        /h\d/,
        /\.[mp][trbl]\-\d/,
        /\.alert.*/
      ]
    })
  ];
  return gulp.src('./dist/style.css')
    .pipe(
      postcss(postcssPlugins)
      .on('error', errorHandler)
    )
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
})

gulp.task('watch', function () {

  gulp.watch([
    "./src/*.html",
  ], gulp.series('views'));

  gulp.watch([
    './src/js/*.js',
  ], gulp.series('scripts'));

  gulp.watch('./src/sass/**/*.scss', gulp.series('styles'));

})

gulp.task('connect', function() {
    connect.server({
      root: 'dist',
      livereload: true
    });
});

var compileAssets = gulp.series('views', 'scripts', 'styles', 'postcss');
var serve = gulp.parallel('connect', 'watch');
gulp.task('default', gulp.series(compileAssets, serve));
