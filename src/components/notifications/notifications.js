(function () {
  'use strict';

  var mod = angular.module('components.notifications', []);

  mod.factory('Notifications', ['$window', function Notifications($window) {

    function create(title, body, icon, tag) {

      return new $window.Notification(title || 'Buffer', {
        body: body,
        icon: $window.location.origin + (icon || '/img/buffer-icon-32.png'),
        tag: tag
      });
    }

    return {
      create: create
    };
  }]);

}());