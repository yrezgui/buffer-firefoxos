(function () {
  'use strict';

  var mod = angular.module('bufferApp.start', []);

  mod.controller('StartCtrl', ['$scope', '$state', 'OAuth', 'BufferApi', '$timeout', function StartCtrl($scope, $state, OAuth, BufferApi, $timeout) {

    var authCode = OAuth.getCode();

    $scope.currentStep = 0;
    $scope.totalSteps  = 3;

    if(!authCode) {
      return $state.go('login');
    }

    OAuth.exchangeAccessToken(authCode).then(function success() {

      $scope.currentStep++;
      BufferApi.getUser().then(function success() {

        $scope.currentStep++;
        BufferApi.getConfiguration().then(function success() {

          $scope.currentStep++;
          BufferApi.getProfiles().then(function success() {

            return $state.go('profile');
          });
        });
      });
    });
  }]);

}());