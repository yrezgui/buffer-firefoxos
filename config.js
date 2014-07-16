var config = module.exports = {};

config.path = {
  build:    './www',
  styles:   ['./src/**/*.less'],
  scripts:  ['./src/**/*.js'],
  views:    ['./src/**/*.jade'],
  fonts:    ['./src/fonts/**/*'],
  images:   ['./src/images/**/*'],
  manifest: ['./src/manifest.webapp']
};

config.vendor = {
  fonts: [
    'bower_components/building-blocks/fonts/**/*'
  ],
  scripts: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/lodash/dist/lodash.js',
    'bower_components/angular/angular.js',
    'bower_components/pouchdb/dist/pouchdb-nightly.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/angular-touch/angular-touch.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/restangular/dist/restangular.js'
  ],
  styles: [
    'bower_components/building-blocks/util.css',
    'bower_components/building-blocks/fonts.css',
    'bower_components/building-blocks/transitions.css',
    'bower_components/building-blocks/icons/**/*.css',
    'bower_components/building-blocks/style/**/*.css'
  ],
  images: [
    'bower_components/building-blocks/icons/**/*.png',
    'bower_components/building-blocks/style/**/*.png'
  ]
};