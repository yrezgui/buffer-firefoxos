var config      = require('./config.js');
var gulp        = require('gulp');
var clean       = require('gulp-clean');
var jade        = require('gulp-jade');
var less        = require('gulp-less');
var es          = require('event-stream');
var path        = require('path');
var runSequence = require('run-sequence');
var _           = require('lodash');

var assetsMap = {};

function changeFolder(subfolder) {
  return es.through(function process(data) {
    var finalpath = path.relative(data.base, data.path);
    finalpath = path.join(subfolder, finalpath);

    data.path = path.join('/tmp', finalpath);
    data.base = '/tmp/';
    this.emit('data', data);
  });
}

function updateAssetsMap(type) {
  if(!assetsMap[type]) {
    assetsMap[type] = [];
  }

  return es.mapSync(function process(data) {
    var file = data.path.split(data.base)[1];

    if(assetsMap[type].indexOf(file) === -1) {
      assetsMap[type].push(file);
    }

    return data;
  });
}

gulp.task('clean', function cleanTask() {
  return gulp.src(config.path.build, {read: false})
             .pipe(clean());
});

gulp.task('manifest', function manifestTask() {
  return gulp.src(config.path.manifest)
             .pipe(gulp.dest(config.path.build));
});

gulp.task('scripts', function scriptsTask() {
  return es.concat(
    gulp.src(config.path.scripts).pipe(updateAssetsMap('scripts')),
    gulp.src(config.vendor.scripts).pipe(changeFolder('vendor')).pipe(updateAssetsMap('vendorScripts'))

  ).pipe(gulp.dest(config.path.build));
});

gulp.task('fonts', function fontsTask() {
  return es.concat(
    gulp.src(config.path.fonts),
    gulp.src(config.vendor.fonts).pipe(changeFolder('vendor'))

  ).pipe(gulp.dest(config.path.build));
});

gulp.task('images', function imagesTask() {
  return es.concat(
    gulp.src(config.path.images).pipe(changeFolder('img')),
    gulp.src(config.vendor.images).pipe(changeFolder('vendor'))

  ).pipe(gulp.dest(config.path.build));
});

gulp.task('styles', function stylesTask() {
  return es.concat(
    gulp.src(config.path.styles).pipe(less()).pipe(updateAssetsMap('styles')),
    gulp.src(config.vendor.styles).pipe(changeFolder('vendor')).pipe(updateAssetsMap('vendorStyles'))

  ).pipe(gulp.dest(config.path.build));
});

function processViews() {
  return gulp.src('src/**/*.jade')
             .pipe(jade({pretty: true, locals: {assets: assetsMap}}))
             .pipe(gulp.dest(config.path.build));
}

gulp.task('views', function viewsTask(callback) {

  if(_.isEmpty(assetsMap)) {
    runSequence(['scripts', 'styles'], function finish() {

      processViews().on('end', callback);
    });
  } else {
    processViews().on('end', callback);
  }
});

gulp.task('build', function buildTask(callback) {
  return runSequence(
    'clean',
    ['manifest', 'scripts', 'fonts', 'images', 'styles'],
    'views',
    callback
  );
});

gulp.task('watch', ['build'], function watchTask(callback){

  console.log('watching...');

  gulp.watch(config.path.images,    ['images']);
  gulp.watch(config.path.fonts,     ['fonts']);
  gulp.watch(config.path.manifest,  ['manifest']);
  gulp.watch(config.path.views,     ['views']);

  gulp.watch(config.path.styles, function watchStyles(event) {
    return runSequence('styles', 'views');
  });

  gulp.watch(config.path.scripts, function watchScripts(event) {
    return runSequence('scripts', 'views');
  });
});

gulp.task('default', ['watch']);