(function () {
  'use strict';

  var mod = angular.module('bufferApp.compose', []);

  mod.factory('WebActivity', ['$rootScope', '$window',  function ComposeCtrl($rootScope, $window) {

    if (!$window.navigator.mozSetMessageHandler) {
      return;
    }

    $window.navigator.mozSetMessageHandler('activity', function(activityRequest) {
      console.log(activityRequest);
      activityRequest.postResult();

      $rootScope.$emit('activity:share', activityRequest.source.data.url);
    });
  }]);

  mod.controller('ComposeCtrl', ['$scope', 'BufferApi', 'Notifications', 'WebActivity', '$state', 'profiles', 'configuration', function ComposeCtrl($scope, BufferApi, Notifications, WebActivity, $state, profiles, configuration) {

    $scope.profiles   = profiles;
    $scope.statusBody = '';
    $scope.loading    = false;
    $scope.writing    = false;

    $scope.selectedProfiles = _.filter(profiles, { 'default': true });

    $scope.getRemainingCount = function getRemainingCount() {
      var selectedServicesIds = _.uniq(_.pluck($scope.selectedProfiles, 'service'));

      var selectedServicesConfiguration = _.filter(configuration.services, function (service, id) {
        return _.indexOf(selectedServicesIds, id) >= 0;
      });

      var minCharacterLimit = _.min(_.map(selectedServicesConfiguration, function(service) {
        return service.types.profile.character_limit;
      }));

      return minCharacterLimit - $scope.statusBody.length;
    };

    $scope.buffer = function buffer() {
      if($scope.loading || $scope.statusBody === '') {
        return;
      }

      $scope.loading = true;
      Notifications.create(null, 'Buffering...', null, 'buffering');

      BufferApi.createUpdate($scope.statusBody, _.pluck($scope.selectedProfiles, '_id')).then(function success() {
        Notifications.create(null, 'One more status in your Buffer !', null, 'buffering');
      });

      var redirectedProfileId = $scope.selectedProfiles[0]._id;

      BufferApi.clearCache();

      $state.go('profile', { profileId: redirectedProfileId });
    };
  }]);

  mod.directive('autoSizeTextarea', ['$window', function autoSizeTextarea($window) {

    return {
      restrict: 'A',
      link: function link(scope, element) {
        element[0].style.height = 'calc(' + ($window.innerHeight - element[0].offsetTop) + 'px - 7rem)';
      }
    };
  }]);

  mod.directive('selectOpener', ['$document', function selectOpener($document) {

    return {
      restrict: 'A',
      link: function link(scope, element) {
        element.on('click', function click() {
          $document[0].querySelector('select').focus();
        });
      }
    };
  }]);

}());