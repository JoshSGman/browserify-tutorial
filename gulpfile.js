
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserSync = require('browser-sync');

var paths = {
  scripts : ['./client/scripts/*.js', './client/scripts/**/*.js', './client/scripts/**/*.coffee']
};

gulp.task('browserify', function(){

  var bundleMethod = global.isWatching ? watchify : browserify;

  var bundler = bundleMethod({
    entries: ['./client/scripts/main.js'],
    extensions: ['.coffee'],
    debug: true
  });

  var bundle  = function() {
    return bundler
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./client/build'))
      .pipe(browserSync.reload({stream: true, once: true}));
  };

  if (global.isWatching) {
    bundler.on('update', bundle); 
  }

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
gulp.task('default', ['browser-sync', 'browserify', 'watch']);

