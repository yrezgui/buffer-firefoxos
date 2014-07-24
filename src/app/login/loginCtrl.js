(function () {
  'use strict';

  var mod = angular.module('bufferApp.login', []);

  mod.controller('LoginCtrl', ['$scope', 'OAuth', function LoginCtrl($scope, OAuth) {
      
    $scope.loginUrl = OAuth.getConnectUrl();
  }]);

}());