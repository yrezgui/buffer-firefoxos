angular.module('bufferApp', [
  'pouchdb',
  'ngTouch',
  'ngAnimate',
  'ngSanitize',
  'ui.router',
])

  .config(['$compileProvider', '$urlRouterProvider', '$stateProvider', function config($compileProvider, $urlRouterProvider, $stateProvider) {

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|tel|sms):/);

    $urlRouterProvider.otherwise('/home');
  }]);