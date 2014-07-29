var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var gutil = require('gulp-util');

var paths = {
  scripts : ['./client/scripts/*.js', './client/scripts/**/*.js']
};

gulp.task('browserify', function(){

  var bundler = watchify(browserify('./client/scripts/app.js', watchify.args));

  var bundle  = function() {
    return bundler
      .bundle()
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./client/build'))
      .pipe(browserSync.reload({stream: true, once: true}));
  };

  bundler.on('update', bundle)

  return bundle();
});

// start server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './client'
        },
        notify: false
    });
});

gulp.task('watch', function(){
  gulp.watch(paths.scripts, ['browserify']);
});

// use default task to launch BrowserSync and watch JS files
gulp.task('default', ['browser-sync','browserify', 'watch']);