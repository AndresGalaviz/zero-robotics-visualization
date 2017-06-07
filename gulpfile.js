var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    ts = require('gulp-typescript'),
    serve = require('gulp-live-server'),
    merge = require('merge2'),
    run = require('gulp-run');

var tsProject = ts.createProject('tsconfig.json',
  {
    typescript: require('typescript'),
    declarationFiles: true,
    noResolve: true
  });
  
gulp.task('build', ['incrBuild'], function () {
  run('node ./node_modules/requirejs/bin/r.js -o tools/build.js').exec()
    .pipe(gulp.dest('output'))
})  

gulp.task('incrBuild', function() {
  console.log('Compiling typescript');
  var tsResult = tsProject.src()
    .pipe(tsProject());

  return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
      tsResult.dts.pipe(gulp.dest('out/definitions')),
      tsResult.js.pipe(gulp.dest('out/scripts/scripts'))
  ]);
});

gulp.task('watch', ['incrBuild'], function() {
    gulp.watch('scripts/**/*.ts', ['incrBuild']);
    gulp.start('serve');
});

gulp.task('serve', function() {
	var server = serve.static('./', 8080);
	server.start();
});
