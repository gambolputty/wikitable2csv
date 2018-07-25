var gulp = require('gulp');
var sass = require('gulp-sass')
var jshint = require('gulp-jshint');
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');
var inject = require('gulp-inject');
var replace = require('gulp-replace');
var jasmineBrowser = require('gulp-jasmine-browser');
var fs = require('fs');
var connect = require('gulp-connect');
var version = JSON.parse(fs.readFileSync('./package.json')).version;
var debug = false;

var paths = {
  src: 'src',
  dist: 'dist',
  npm: 'node_modules',
};

function errorHandler(error) {
  notify({
    title: 'Gulp Task Error',
    message: 'Check the console.'
  }).write(error);
  console.log(error.toString());
  this.emit('end');
}

gulp.task('testFixtures', function () {
  return gulp.src(paths.src + '/index.html')
    // Inject head html
    .pipe(inject(gulp.src(paths.src + '/head.html'), {
      starttag: '<!-- inject:head:{{ext}} -->',
      removeTags: true,
      transform: function (filePath, file) {
        // return file contents as string
        return file.contents.toString('utf8')
      }
    }))
    .pipe(replace('%%GULP_INJECT_PATH%%', 'spec/fixtures/'))
    .pipe(replace('%%GULP_INJECT_VERSION%%', version))
    // copy html files
    .pipe(gulp.dest('spec/fixtures'));
  gulp.src([paths.dist + '/app.js', paths.dist + '/style.css',])
    .pipe(gulp.dest('spec/fixtures'));
})

gulp.task('test', function () {
  var filesForTest = [
    paths.npm + '/jquery/dist/jquery.js',
    paths.npm + '/jasmine-jquery/lib/jasmine-jquery.js',
    'spec/fixtures/*',
    'spec/app_spec.js'
  ];
  return gulp.src(filesForTest, { base: '.' })
    .pipe(watch(filesForTest, { base: '.' }))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
})

gulp.task('views', function () {
  var stream = gulp.src(paths.src + '/index.html')
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
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload());
})

gulp.task('scripts', function  () {
  var stream = gulp.src([

      // Vendor
      paths.npm + '/clipboard/dist/clipboard.js',

      // app
      paths.src + '/js/helper.js',      
      paths.src + '/js/methods.js',      
      paths.src + '/js/app.js',      

    ], {
      base: paths.src
    })
    .pipe(replace('%%GULP_INJECT_DEBUG%%', debug))
    .pipe(concat('app.js'));

  if (debug == false) {
    stream.pipe(uglify());
  }

  return stream
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload());
})

gulp.task('styles', function () {
  return gulp.src(paths.src + '/sass/style.scss')
    .pipe(
      sass({outputStyle: 'compressed'})
      .on('error', errorHandler)
    )
    .pipe(
      uncss({
        html: [paths.src + '/index.html'],
        ignore: [
          /\.table2csv/,
          /\.btn\-.+/,
          /h\d/,
          /\.[mp][trbl]\-\d/,
          /\.alert.*/
        ]
      })
    )
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload());
})

gulp.task('watch', function () {

  gulp.watch([
    paths.src + "/*.html",
  ], gulp.series('views'));

  gulp.watch([
    paths.src + '/js/*.js',
  ], gulp.series('scripts'));

  gulp.watch(paths.src + '/sass/**/*.scss', gulp.series('styles'));

})

gulp.task('connect', function() {
    connect.server({
      root: 'dist',
      livereload: true
    });
});

var compileAssets = gulp.parallel('views', 'scripts', 'styles');
var serve = gulp.parallel('connect', 'watch');
gulp.task('default', gulp.series(compileAssets, serve));
