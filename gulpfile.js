var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass')
var jshint = require('gulp-jshint');
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var uncss = require('gulp-uncss');
var inject = require('gulp-inject');
var replace = require('gulp-replace');
var jasmineBrowser = require('gulp-jasmine-browser');
var watch = require('gulp-watch');

var fs = require('fs');
var version = JSON.parse(fs.readFileSync('./package.json')).version;

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

gulp.task('testFixtures', function() {
  gulp.src(paths.src + '/index.html')
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
});   

gulp.task('test', ['testFixtures'], function() {
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
});

gulp.task('views', [], function() {
  gulp.src(paths.src + '/index.html')
    // Inject head html
    .pipe(inject(gulp.src(paths.src + '/head.html'), {
      starttag: '<!-- inject:head:{{ext}} -->',
      removeTags: true,
      transform: function (filePath, file) {
        // return file contents as string
        return file.contents.toString('utf8')
      }
    }))
    .pipe(replace('%%GULP_INJECT_PATH%%', ''))
    .pipe(replace('%%GULP_INJECT_VERSION%%', version))
    // copy html files
    .pipe(gulp.dest(paths.dist))
    .pipe(livereload());
});

gulp.task('javascript', [], function() {
  gulp.src([

      // Vendor
      paths.npm + '/clipboard/dist/clipboard.js',

      // app
      paths.src + '/js/helper.js',      
      paths.src + '/js/methods.js',      
      paths.src + '/js/app.js',      

    ], {
      base: paths.src
    })
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(gulp.dest(paths.dist))
    .pipe(livereload());
});

gulp.task('sass', function() {
  gulp.src(paths.src + '/sass/style.scss')
    .pipe(sass({
        outputStyle: 'compressed',
        includePaths: [paths.src + '/sass']
      })
      .on('error', errorHandler))
    .pipe(uncss({
        html: [paths.src + '/index.html'],
        ignore: [/\.table2csv/, /\.btn\-.+/, /h\d/, /\.[mp][trbl]\-\d/, /\.alert.*/]
    }))
    .pipe(gulp.dest(paths.dist));
});

// Clean Images
gulp.task('clean:images', [], function() {
  return del([
    paths.dist + '/img/**/*.{jpg,png,svg,gif,webp,ico}'
  ], { force: true });
});

gulp.task('images', [], function() {
  gulp.src(paths.src + '/img/**/*.{jpg,png,svg,gif,webp,ico}', {
      base: paths.src
    })
    .pipe(gulp.dest(paths.dist))
    .pipe(livereload());
});


/**
 *  Watch
 */
gulp.task('watch', function() {

  livereload.listen();

  gulp.watch([
    paths.src + "/*.html",
  ], ['views', 'sass']);

  gulp.watch([
    paths.src + '/js/*.js',
  ], ['javascript']);

  gulp.watch(paths.src + '/sass/**/*.scss', ['sass']);
  gulp.watch(paths.src + '/img/**/*', ['images']);

});

gulp.task('default', [
  'watch',
  'views', 'javascript', 'sass', 'images', 'test'
]);