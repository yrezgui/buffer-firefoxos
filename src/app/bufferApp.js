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
  'bufferApp.profile',
  'bufferApp.compose'
])

  .config(['$urlRouterProvider', '$stateProvider', function config($urlRouterProvider, $stateProvider) {

    var isConnected = ['OAuth', '$state', '$window', 'BufferApi', function isConnected(OAuth, $state, $window, BufferApi) {
      if(OAuth.isConnected()) {
        return BufferApi.getProfileById(null, true).then(function success(profile) {
          $window.location.href = $state.href('profile', { profileId: profile._id });
        });
      } else {
        return false;
      }
    }];

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl',
        resolve: {
          isConnected: isConnected
        }
      })
      .state('start', {
        url: '/start',
        templateUrl: 'app/start/start.html',
        controller: 'StartCtrl',
        resolve: {
          isConnected: isConnected
        }
      })
      .state('profile', {
        url: '/profile/:profileId',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          profiles: ['BufferApi', function profiles(BufferApi) {
            return BufferApi.getProfiles();
          }],
          currentProfile: ['BufferApi', function currentProfile(BufferApi) {
            return BufferApi.getCurrentProfile();
          }]
        }
      })
      .state('compose', {
        url: '/compose',
        templateUrl: 'app/compose/compose.html',
        controller: 'ComposeCtrl',
        resolve: {
          profiles: ['BufferApi', function profiles(BufferApi) {
            return BufferApi.getProfiles();
          }],
          configuration: ['BufferApi', function configuration(BufferApi) {
            return BufferApi.getConfiguration();
          }]
        }
      });

    $urlRouterProvider.otherwise('/login');
  }]);