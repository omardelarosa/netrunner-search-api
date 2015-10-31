var gulp        = require('gulp');
var server      = require('./server');
var nodemon     = require('gulp-nodemon');
var importer    = require('./lib/importer');

gulp.task('default', [ 'server' ]);

gulp.task('importCards', function (done) {
  return importer().then(function(status){
    console.log('Import complete.');
    console.log('Status:', status);
    process.exit(0);
  })
  .catch(function(err) {
    console.log('Error:');
    console.log(err.message);
    console.log(err.stack);
    process.exit(1);
  });
});

gulp.task('server', function () {
  nodemon({
    script: 'index.js',
    ext: 'js html',
    ignore: [ 'node_modules/' ]
  }).on('restart', function () {
    console.log('restarted server');
  });
});
