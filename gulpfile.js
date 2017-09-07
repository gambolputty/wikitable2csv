var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass')
var jshint = require('gulp-jshint');
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var uncss = require('gulp-uncss');

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

// JSHint task
gulp.task('lint', function() {
  gulp.src(paths.src + '/js/*.js')
    .pipe(jshint())
    // You can look into pretty reporters as well, but that's another story
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('views', [], function() {

  // php html
  gulp.src(paths.src + "/*.{html,php}")
    .pipe(gulp.dest(paths.dist))
    .pipe(livereload());

});

gulp.task('javascript', [], function() {

  gulp.src([

      // Vendor
      paths.npm + '/jquery/dist/jquery.js',
      paths.npm + '/clipboard/dist/clipboard.js',

      // scripts
      // paths.src + '/js/wikis.js',
      paths.src + '/js/scripts.js',

    ], {
      base: paths.src
    })
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(concat('scripts.js'))
    .pipe(plumber({ errorHandler: errorHandler }))
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
        ignore: [/\#output.+/, /\.btn\-.+/, /h\d/, /\.[mp][trbl]\-\d/, /\.alert.*/]
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
    paths.src + "/*.{html,php}",
  ], ['views']);

  gulp.watch([
    paths.src + '/js/*.js',
  ], ['javascript']);

  gulp.watch(paths.src + '/sass/**/*.scss', ['sass']);
  gulp.watch(paths.src + '/img/**/*', ['images']);

});

gulp.task('default', [
  'watch',
  'views', 'javascript', 'sass', 'images'
]);