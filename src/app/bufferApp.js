angular.module('bufferApp', [
  'ngTouch',
  'ngAnimate',
  'ngSanitize',
  'ui.router',
  'angular-data.DSCacheFactory',
  'components.utils',
  'components.config',
  'components.localStorage',
  'components.notifications',
  'components.oauth',
  'components.bufferApi',
  'bufferApp.login',
  'bufferApp.start',
  'bufferApp.profile'
])

  .config(['$compileProvider', '$urlRouterProvider', '$stateProvider', function config($compileProvider, $urlRouterProvider, $stateProvider) {

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|tel|sms):/);

    $urlRouterProvider.otherwise('/home');
  }]);