(function () {
  'use strict';

  var mod = angular.module('bufferApp.profile', []);

  mod.controller('ProfileCtrl', ['$scope', '$stateParams', 'OAuth', 'BufferApi', 'Notifications', 'profiles', 'currentProfile', function ProfileCtrl($scope, $stateParams, OAuth, BufferApi, Notifications, profiles, currentProfile) {

    $scope.showSidebar        = false;
    $scope.showSentTab        = false;
    $scope.loadingData        = true;
    $scope.actionsMenuHidden  = true;
    $scope.selectedStatus     = null;
    $scope.profiles           = profiles;
    $scope.currentProfile     = currentProfile;

    function getUpdates(type, forceRefresh) {
      if(type === 'sent') {

        BufferApi.getSentUpdates($scope.currentProfile._id, forceRefresh).then(function success(result) {
          $scope.sentUpdates = result.updates;
          $scope.loadingData = false;
        });
      } else {

        BufferApi.getPendingUpdates($scope.currentProfile._id, forceRefresh).then(function success(result) {
          $scope.pendingUpdates = result.updates;
          $scope.loadingData = false;
        });
      }
    }

    $scope.logout = OAuth.logout;

    $scope.showTab = function showTab(name, forceRefresh) {
      $scope.loadingData = true;

      if(name === 'sent') {
        $scope.showSentTab = true;
        getUpdates('sent', forceRefresh);

      } else {
        $scope.showSentTab = false;
        getUpdates('pending', forceRefresh);
      }
    };

    $scope.showActionsMenu = function showActionsMenu(status) {
      $scope.selectedStatus    = status;
      $scope.actionsMenuHidden = false;
    };

    $scope.hideActionsMenu = function hideActionsMenu() {
      $scope.selectedStatus    = null;
      $scope.actionsMenuHidden = true;
    };

    $scope.shareNowStatus = function shareNowStatus() {
      Notifications.create(null, 'Sharing...', null, 'share-now');

      return BufferApi.shareNow($scope.selectedStatus._id).then(function success() {
        $scope.showTab('pending', true);
        $scope.hideActionsMenu();

        Notifications.create(null, 'Update successfully shared !', null, 'share-now');
      });
    };

    $scope.deleteStatus = function deleteStatus() {
      Notifications.create(null, 'Deleting...', null, 'delete');

      return BufferApi.deleteStatus($scope.selectedStatus._id).then(function success() {
        $scope.showTab('pending', true);
        $scope.hideActionsMenu();

        Notifications.create(null, 'Update successfully deleted !', null, 'delete');
      });
    };

    // Default behavior of the page
    $scope.showTab('pending');
  }]);

}());